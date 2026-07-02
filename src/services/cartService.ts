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
  shippingType?: string;
  shippingCost?: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  // New backend-computed pricing fields
  subtotal: number;
  highestShipping: number;
  gstPercentage: number;
  gstAmount: number;
  grandTotal: number;
  // Legacy field — equals grandTotal
  totalAmount: number;
  totalItems: number;
}

class CartService {
  // Helper to get auth token
  private getAuthHeader() {
    console.log('==================== DEBUG START - GET AUTH HEADER ====================');
    console.log('[CART SERVICE] Retrieving authentication token');

    // Check all token locations
    const userToken = localStorage.getItem('userToken');
    const garjaToken = localStorage.getItem('garja_token');
    const plainToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('userToken');

    console.log('[CART SERVICE] Token Check:');
    console.log('  - localStorage.userToken:', userToken ? `EXISTS (${userToken.substring(0, 20)}...)` : 'NOT FOUND');
    console.log('  - localStorage.garja_token:', garjaToken ? `EXISTS (${garjaToken.substring(0, 20)}...)` : 'NOT FOUND');
    console.log('  - localStorage.token:', plainToken ? `EXISTS (${plainToken.substring(0, 20)}...)` : 'NOT FOUND');
    console.log('  - sessionStorage.userToken:', sessionToken ? `EXISTS (${sessionToken.substring(0, 20)}...)` : 'NOT FOUND');

    const token = getStoredToken();

    console.log('[CART SERVICE] getStoredToken() result:', token ? `FOUND (${token.substring(0, 30)}...)` : 'NULL/UNDEFINED');

    if (!token) {
      console.error('[CART SERVICE] NO TOKEN FOUND - Authentication required');
      console.log('==================== DEBUG END - GET AUTH HEADER ====================');
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('[CART SERVICE] Headers created:');
    console.log('  - Authorization:', `Bearer ${token.substring(0, 30)}...`);
    console.log('  - Content-Type:', 'application/json');
    console.log('==================== DEBUG END - GET AUTH HEADER ====================');

    return headers;
  }

  // Add product to cart
  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    console.log('==================== DEBUG START - ADD TO CART ====================');
    console.log('[API REQUEST START]');
    console.log('[CART SERVICE] addToCart called');
    console.log('[CART SERVICE] Current URL:', window.location.href);
    console.log('[CART SERVICE] Input Parameters:');
    console.log('  - productId:', productId);
    console.log('  - quantity:', quantity);
    console.log('[CART SERVICE] API Base URL:', API_URL);
    console.log('[CART SERVICE] Target Endpoint:', `${API_URL}/api/cart/add`);
    console.log('[CART SERVICE] Request Method:', 'POST');

    try {
      const headers = this.getAuthHeader();

      console.log('[CART SERVICE] Request Payload:', { productId, quantity });
      console.log('[CART SERVICE] All Request Headers:', headers);
      console.log('[CART SERVICE] Sending request via axios.post...');

      const response = await axios.post(
        `${API_URL}/api/cart/add`,
        { productId, quantity },
        {
          headers: headers
        }
      );

      console.log('[API REQUEST END]');
      console.log('[CART SERVICE] Request successful');
      console.log('[CART SERVICE] Response Status:', response.status);
      console.log('[CART SERVICE] Response Headers:', response.headers);
      console.log('[CART SERVICE] Response Data:', response.data);
      console.log('==================== DEBUG END - ADD TO CART ====================');

      return response.data;
    } catch (error: any) {
      console.log('[API REQUEST FAILED]');
      console.error('[CART SERVICE] Request failed');
      console.error('[CART SERVICE] Error Type:', error.constructor.name);
      console.error('[CART SERVICE] Error Message:', error.message);
      console.error('[CART SERVICE] Error Response Status:', error.response?.status);
      console.error('[CART SERVICE] Error Response Headers:', error.response?.headers);
      console.error('[CART SERVICE] Error Response Data:', error.response?.data);
      console.error('[CART SERVICE] Error Config URL:', error.config?.url);
      console.error('[CART SERVICE] Error Config Method:', error.config?.method);
      console.error('[CART SERVICE] Error Config Headers:', error.config?.headers);

      // Check for redirect
      if (error.response?.status === 302 || error.response?.status === 301) {
        console.error('[CART SERVICE] REDIRECT DETECTED!');
        console.error('[CART SERVICE] Redirect Location:', error.response?.headers?.location);
      }

      // Check for CORS error
      if (error.message && error.message.includes('CORS')) {
        console.error('[CART SERVICE] CORS ERROR DETECTED!');
      }

      if (!error.response) {
        console.error('[CART SERVICE] No response received - Network error or CORS issue');
      }

      console.log('==================== DEBUG END - ADD TO CART ====================');

      if (error.response?.status === 401) {
        throw new Error('Please login to add items to cart');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to add item to cart');
    }
  }

  // Get current cart
  async getCart(): Promise<Cart | null> {
    console.log('==================== DEBUG START - GET CART ====================');
    console.log('[API REQUEST START]');
    console.log('[CART SERVICE] getCart called');
    console.log('[CART SERVICE] Target URL:', `${API_URL}/api/cart`);

    try {
      const headers = this.getAuthHeader();
      console.log('[CART SERVICE] Sending GET request...');

      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: headers
      });

      console.log('[API REQUEST END]');
      console.log('[CART SERVICE] Get cart successful');
      console.log('[CART SERVICE] Response Status:', response.status);
      console.log('[CART SERVICE] Cart Data:', response.data);
      console.log('==================== DEBUG END - GET CART ====================');

      return response.data;
    } catch (error: any) {
      console.log('[API REQUEST FAILED]');
      console.error('[CART SERVICE] Get cart failed');
      console.error('[CART SERVICE] Error:', error.message);
      console.error('[CART SERVICE] Status:', error.response?.status);
      console.log('==================== DEBUG END - GET CART ====================');

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
