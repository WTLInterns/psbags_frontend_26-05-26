import axios from 'axios';
import { API_BASE_URL } from '@/utils/apiConfig';
import { getStoredToken } from '@/utils/authToken';

const API_URL = API_BASE_URL;

// Wishlist interfaces based on API response
export interface WishlistItem {
  id: number;
  userId?: number;
  productId: number;
  productName: string;
  price: string;
  imageUrl: string;
  category?: string;
  dateAdded: string;
}

class WishlistService {
  private cachedWishlist: WishlistItem[] | null = null;

  // Helper to get auth token (backend identifies user via JWT, not URL param)
  private getAuthHeaders() {
    console.log('==================== DEBUG START - GET WISHLIST AUTH HEADER ====================');
    console.log('[WISHLIST SERVICE] Retrieving authentication token');

    // Check all token locations
    const userToken = localStorage.getItem('userToken');
    const garjaToken = localStorage.getItem('garja_token');
    const plainToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('userToken');

    console.log('[WISHLIST SERVICE] Token Check:');
    console.log('  - localStorage.userToken:', userToken ? `EXISTS (${userToken.substring(0, 20)}...)` : 'NOT FOUND');
    console.log('  - localStorage.garja_token:', garjaToken ? `EXISTS (${garjaToken.substring(0, 20)}...)` : 'NOT FOUND');
    console.log('  - localStorage.token:', plainToken ? `EXISTS (${plainToken.substring(0, 20)}...)` : 'NOT FOUND');
    console.log('  - sessionStorage.userToken:', sessionToken ? `EXISTS (${sessionToken.substring(0, 20)}...)` : 'NOT FOUND');

    const token = getStoredToken();

    console.log('[WISHLIST SERVICE] getStoredToken() result:', token ? `FOUND (${token.substring(0, 30)}...)` : 'NULL/UNDEFINED');

    if (!token) {
      console.error('[WISHLIST SERVICE] NO TOKEN FOUND - Authentication required');
      console.log('==================== DEBUG END - GET WISHLIST AUTH HEADER ====================');
      throw new Error('Authentication required');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('[WISHLIST SERVICE] Headers created:');
    console.log('  - Authorization:', `Bearer ${token.substring(0, 30)}...`);
    console.log('  - Content-Type:', 'application/json');
    console.log('==================== DEBUG END - GET WISHLIST AUTH HEADER ====================');

    return headers;
  }

  private invalidateCache() {
    this.cachedWishlist = null;
  }

  // Add product to wishlist
  async addToWishlist(productId: number): Promise<string> {
    console.log('==================== DEBUG START - ADD TO WISHLIST ====================');
    console.log('[API REQUEST START]');
    console.log('[WISHLIST SERVICE] addToWishlist called');
    console.log('[WISHLIST SERVICE] Current URL:', window.location.href);
    console.log('[WISHLIST SERVICE] Input Parameters:');
    console.log('  - productId:', productId);
    console.log('[WISHLIST SERVICE] API Base URL:', API_URL);
    console.log('[WISHLIST SERVICE] Target Endpoint:', `${API_URL}/api/wishlist/add`);
    console.log('[WISHLIST SERVICE] Request Method:', 'POST');

    try {
      const headers = this.getAuthHeaders();
      const payload = { productId };

      console.log('[WISHLIST SERVICE] Request Payload:', payload);
      console.log('[WISHLIST SERVICE] All Request Headers:', headers);
      console.log('[WISHLIST SERVICE] Sending request via axios.post...');

      const response = await axios.post(
        `${API_URL}/api/wishlist/add`,
        payload,
        { headers }
      );

      console.log('[API REQUEST END]');
      console.log('[WISHLIST SERVICE] Request successful');
      console.log('[WISHLIST SERVICE] Response Status:', response.status);
      console.log('[WISHLIST SERVICE] Response Headers:', response.headers);
      console.log('[WISHLIST SERVICE] Response Data:', response.data);
      console.log('==================== DEBUG END - ADD TO WISHLIST ====================');

      this.invalidateCache();
      return response.data;
    } catch (error: any) {
      console.log('[API REQUEST FAILED]');
      console.error('[WISHLIST SERVICE] Request failed');
      console.error('[WISHLIST SERVICE] Error Type:', error.constructor.name);
      console.error('[WISHLIST SERVICE] Error Message:', error.message);
      console.error('[WISHLIST SERVICE] Error Response Status:', error.response?.status);
      console.error('[WISHLIST SERVICE] Error Response Headers:', error.response?.headers);
      console.error('[WISHLIST SERVICE] Error Response Data:', error.response?.data);
      console.error('[WISHLIST SERVICE] Error Config URL:', error.config?.url);
      console.error('[WISHLIST SERVICE] Error Config Method:', error.config?.method);
      console.error('[WISHLIST SERVICE] Error Config Headers:', error.config?.headers);

      // Check for redirect
      if (error.response?.status === 302 || error.response?.status === 301) {
        console.error('[WISHLIST SERVICE] REDIRECT DETECTED!');
        console.error('[WISHLIST SERVICE] Redirect Location:', error.response?.headers?.location);
      }

      // Check for CORS error
      if (error.message && error.message.includes('CORS')) {
        console.error('[WISHLIST SERVICE] CORS ERROR DETECTED!');
      }

      if (!error.response) {
        console.error('[WISHLIST SERVICE] No response received - Network error or CORS issue');
      }

      console.log('==================== DEBUG END - ADD TO WISHLIST ====================');

      if (error.response?.status === 401) {
        throw new Error('Please login to add items to wishlist');
      }
      if (error.response?.status === 409) {
        throw new Error('Item already in wishlist');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to add item to wishlist');
    }
  }

  // Remove product from wishlist by product ID
  async removeFromWishlistByProductId(productId: number): Promise<string> {
    try {
      const headers = this.getAuthHeaders();
      const response = await axios.delete(
        `${API_URL}/api/wishlist/remove/${productId}`,
        { headers }
      );
      this.invalidateCache();
      return response.data;
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to modify wishlist');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to remove item from wishlist');
    }
  }

  // Remove from wishlist by wishlist item ID
  async removeFromWishlist(wishlistId: number): Promise<string> {
    try {
      const headers = this.getAuthHeaders();
      const response = await axios.delete(
        `${API_URL}/api/wishlist/${wishlistId}`,
        { headers }
      );
      this.invalidateCache();
      return response.data;
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to modify wishlist');
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to remove item from wishlist');
    }
  }

  // Get user's wishlist
  async getWishlist(forceRefresh: boolean = false): Promise<WishlistItem[]> {
    try {
      if (!forceRefresh && this.cachedWishlist) {
        return this.cachedWishlist;
      }

      const headers = this.getAuthHeaders();
      const response = await axios.get(
        `${API_URL}/api/wishlist`,
        { headers }
      );
      const data = Array.isArray(response.data) ? response.data : [];
      // Normalize different possible shapes into WishlistItem
      const normalized: WishlistItem[] = data.map((raw: any) => {
        const id = Number(raw.id ?? raw.wishlistId);
        const productId = Number(raw.productId);
        const productName = String(raw.productName ?? raw.name ?? '');
        const imageUrl = String(raw.imageUrl ?? raw.productImage ?? '');
        const priceStr = String(raw.price ?? raw.productPrice ?? '0');
        const category = raw.category ? String(raw.category) : undefined;
        const dateAdded = raw.dateAdded ? String(raw.dateAdded) : new Date().toISOString();
        return {
          id,
          userId: raw.userId ? Number(raw.userId) : undefined,
          productId,
          productName,
          imageUrl,
          price: priceStr,
          category,
          dateAdded,
        } as WishlistItem;
      });
      this.cachedWishlist = normalized;
      return normalized;
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        throw new Error('Please login to view wishlist');
      }
      // Return empty array if no wishlist exists
      if (error.response?.status === 404) {
        this.cachedWishlist = [];
        return [];
      }
      throw new Error(error.response?.data?.message || error.response?.data || 'Failed to fetch wishlist');
    }
  }

  // Check if product is in wishlist
  async isProductInWishlist(productId: number): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.some(item => item.productId === productId);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      return false;
    }
  }

  // Get wishlist count
  async getWishlistCount(): Promise<number> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.length;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      return 0;
    }
  }

  // Toggle product in wishlist (add if not present, remove if present)
  async toggleWishlist(productId: number): Promise<{ action: 'added' | 'removed', message: string }> {
    try {
      const isInWishlist = await this.isProductInWishlist(productId);

      if (isInWishlist) {
        const message = await this.removeFromWishlistByProductId(productId);
        return { action: 'removed', message };
      } else {
        const message = await this.addToWishlist(productId);
        return { action: 'added', message };
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  }

  // Clear entire wishlist (may need backend endpoint)
  async clearWishlist(): Promise<void> {
    try {
      const wishlist = await this.getWishlist(true);
      // Remove each item individually
      await Promise.all(
        wishlist.map(item => this.removeFromWishlist(item.id))
      );
      this.cachedWishlist = [];
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw new Error('Failed to clear wishlist');
    }
  }
}

export const wishlistService = new WishlistService();
