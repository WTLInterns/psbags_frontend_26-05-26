import axios from 'axios';
import { API_BASE_URL } from '@/utils/apiConfig';
import { getStoredToken } from '@/utils/authToken';

const API_URL = API_BASE_URL;

// Cart interfaces based on API response
export interface CartItem {
  id: number;
  quantity: number;
  lineTotal: number;
  size: string;
  productId: number;
  productName: string;
  price: string;
  imageUrl: string;
  category: string;
  isActive: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

class CartService {
  // Helper to get auth token
  private getAuthHeader() {
    const token = getStoredToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Add product to cart
  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    try {
      const response = await axios.post(
        `${API_URL}/api/cart/add`,
        { productId, quantity },
        {
          headers: this.getAuthHeader()
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to add items to cart');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to add item to cart');
    }
  }

  // Get current cart
  async getCart(): Promise<Cart | null> {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to view cart');
      }
      // Return empty cart if no cart exists
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to fetch cart');
    }
  }

  // Remove product from cart
  async removeFromCart(productId: number): Promise<Cart> {
    try {
      const response = await axios.delete(
        `${API_URL}/api/cart/remove/${productId}`,
        {
          headers: this.getAuthHeader()
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to modify cart');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to remove item from cart');
    }
  }

  // Update product quantity in cart
  async updateQuantity(productId: number, quantity: number): Promise<Cart> {
    try {
      const response = await axios.put(
        `${API_URL}/api/cart/update/${productId}`,
        null,
        {
          params: { quantity },
          headers: this.getAuthHeader()
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to modify cart');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to update quantity');
    }
  }

  // Update product size in cart
  async updateSize(productId: number, size: string): Promise<Cart> {
    try {
      const response = await axios.put(
        `${API_URL}/api/cart/size/${productId}`,
        null,
        {
          params: { size },
          headers: this.getAuthHeader()
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating size:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to modify cart');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to update size');
    }
  }

  // Clear all items from cart
  async clearCart(): Promise<string> {
    try {
      const response = await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to clear cart');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to clear cart');
    }
  }

  // Get cart item count (helper method)
  async getCartItemCount(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart?.totalItems || 0;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }

  // Get cart total (helper method)
  async getCartTotal(): Promise<number> {
    try {
      const cart = await this.getCart();
      return cart?.totalAmount || 0;
    } catch (error) {
      console.error('Error getting cart total:', error);
      return 0;
    }
  }

  // Check if product is in cart (helper method)
  async isProductInCart(productId: number): Promise<boolean> {
    try {
      const cart = await this.getCart();
      if (!cart) return false;
      return cart.items.some(item => item.productId === productId);
    } catch (error) {
      console.error('Error checking cart:', error);
      return false;
    }
  }
}

export const cartService = new CartService();
