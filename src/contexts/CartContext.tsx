'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CartItem, Product } from '@/types/product';
import SuccessNotification from '@/components/SuccessNotification';
import { cartService, Cart as BackendCart } from '@/services/cartService';
import { productService } from '@/services/productService';
import { useAuth } from '@/contexts/AuthContext';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  // Backend-computed pricing — single source of truth
  subtotal: number;
  highestShipping: number;
  gstPercentage: number;
  gstAmount: number;
  grandTotal: number;
  // Legacy alias so existing consumers don't break
  totalAmount: number;
  showSuccessNotification: boolean;
  successMessage: string;
  successIsError: boolean;
}

type CartAction =
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; backendCart: BackendCart | null } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SHOW_SUCCESS'; payload: string; isError?: boolean }
  | { type: 'HIDE_SUCCESS' };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number, selectedSize: string, selectedColor: string) => Promise<boolean>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  showSuccessNotification: (message: string) => void;
  hideSuccessNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const buildTotalsFromBackend = (backendCart: BackendCart | null) => ({
  subtotal: backendCart?.subtotal ?? backendCart?.totalAmount ?? 0,
  highestShipping: backendCart?.highestShipping ?? 0,
  gstPercentage: backendCart?.gstPercentage ?? 18,
  gstAmount: backendCart?.gstAmount ?? 0,
  grandTotal: backendCart?.grandTotal ?? backendCart?.totalAmount ?? 0,
  totalAmount: backendCart?.grandTotal ?? backendCart?.totalAmount ?? 0,
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART': {
      const { items, backendCart } = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      return {
        ...state,
        items,
        totalItems,
        ...buildTotalsFromBackend(backendCart),
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        subtotal: 0,
        highestShipping: 0,
        gstPercentage: state.gstPercentage,
        gstAmount: 0,
        grandTotal: 0,
        totalAmount: 0,
      };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'SHOW_SUCCESS':
      return {
        ...state,
        showSuccessNotification: true,
        successMessage: action.payload,
        successIsError: action.isError ?? false,
      };

    case 'HIDE_SUCCESS':
      return {
        ...state,
        showSuccessNotification: false,
        successMessage: '',
        successIsError: false,
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  subtotal: 0,
  highestShipping: 0,
  gstPercentage: 18,
  gstAmount: 0,
  grandTotal: 0,
  totalAmount: 0,
  showSuccessNotification: false,
  successMessage: '',
  successIsError: false,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Map backend cart items to frontend CartItem shape
  const mapBackendCartToFrontend = async (backendCart: BackendCart): Promise<CartItem[]> => {
    const items: CartItem[] = [];
    for (const bi of backendCart.items) {
      try {
        const prod = await productService.getProductById(String(bi.productId));
        const product: Product = prod || {
          id: String(bi.productId),
          name: bi.productName,
          price: parseFloat(String(bi.price).replace(/[^0-9.]/g, '')) || 0,
          originalPrice: undefined,
          description: '',
          category: 'shop online',
          images: [bi.imageUrl],
          sizes: ['XS', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black'],
          inStock: bi.isActive === 'true' || bi.isActive === '1',
          stockQuantity: 0,
          rating: 4.5,
          reviewCount: 0,
          tags: [],
          shippingType: (bi as any).shippingType === 'PAID' ? 'PAID' : 'FREE',
          shippingCost: (bi as any).shippingCost ?? 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        items.push({
          id: `${bi.id}`,
          product,
          quantity: bi.quantity,
          selectedSize: bi.size || (product.sizes[0] || 'M'),
          selectedColor: product.colors[0] || 'Black',
          addedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('[Cart] Failed to map backend cart item:', bi, e);
      }
    }
    return items;
  };

  // Refresh cart from backend and dispatch LOAD_CART with pricing
  const refreshCart = async () => {
    try {
      const backend = await cartService.getCart();
      if (backend) {
        const items = await mapBackendCartToFrontend(backend);
        dispatch({ type: 'LOAD_CART', payload: { items, backendCart: backend } });
      } else {
        dispatch({ type: 'LOAD_CART', payload: { items: [], backendCart: null } });
      }
    } catch (e) {
      console.error('[Cart] Failed to refresh cart:', e);
    }
  };

  // Load cart on mount / auth change
  useEffect(() => {
    const loadCart = async () => {
      if (pathname?.startsWith('/admin')) {
        dispatch({ type: 'LOAD_CART', payload: { items: [], backendCart: null } });
        return;
      }
      if (!isAuthenticated) {
        dispatch({ type: 'LOAD_CART', payload: { items: [], backendCart: null } });
        return;
      }
      await refreshCart();
    };
    loadCart();
  }, [isAuthenticated, pathname]);

  const addItem = async (product: Product, quantity: number, selectedSize: string, selectedColor: string): Promise<boolean> => {
    try {
      await cartService.addToCart(Number(product.id), quantity);
      try {
        if (selectedSize) await cartService.updateSize(Number(product.id), selectedSize);
      } catch (e) {
        console.warn('[Cart] updateSize failed:', e);
      }
      await refreshCart();
      dispatch({ type: 'SHOW_SUCCESS', payload: `${product.name} added to cart successfully!` });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 2500);
      return true;
    } catch (e: any) {
      const errorMsg = e.message || 'Failed to add to cart';
      dispatch({ type: 'SHOW_SUCCESS', payload: errorMsg, isError: true });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 3000);
      return false;
    }
  };

  const removeItem = async (id: string) => {
    try {
      const item = state.items.find(i => i.id === id);
      if (!item) return;
      await cartService.removeFromCart(Number(item.product.id));
      await refreshCart();
      dispatch({ type: 'SHOW_SUCCESS', payload: `${item.product.name} removed from cart` });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 2000);
    } catch (e: any) {
      dispatch({ type: 'SHOW_SUCCESS', payload: e.message || 'Failed to remove item', isError: true });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 3000);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      const item = state.items.find(i => i.id === id);
      if (!item) return;
      await cartService.updateQuantity(Number(item.product.id), quantity);
      await refreshCart();
    } catch (e: any) {
      dispatch({ type: 'SHOW_SUCCESS', payload: e.message || 'Failed to update quantity', isError: true });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 3000);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SHOW_SUCCESS', payload: 'Cart cleared successfully' });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 2000);
    } catch (e: any) {
      dispatch({ type: 'SHOW_SUCCESS', payload: e.message || 'Failed to clear cart', isError: true });
      setTimeout(() => dispatch({ type: 'HIDE_SUCCESS' }), 3000);
    }
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });
  const showSuccessNotification = (message: string) => dispatch({ type: 'SHOW_SUCCESS', payload: message });
  const hideSuccessNotification = () => dispatch({ type: 'HIDE_SUCCESS' });

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        showSuccessNotification,
        hideSuccessNotification,
      }}
    >
      {children}
      <SuccessNotification
        message={state.successMessage}
        isVisible={state.showSuccessNotification}
        onClose={hideSuccessNotification}
        isError={state.successIsError}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
