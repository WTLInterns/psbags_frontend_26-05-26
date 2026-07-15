// Color Service - Production API Integration
// Connects to backend color management APIs

import axios from 'axios';
import { API_BASE_URL } from '@/utils/apiConfig';

export interface ColorMaster {
  id: number;
  name: string;
  displayName: string;
  hexCode: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

class ColorService {
  /**
   * Get all active colors (sorted by sortOrder, displayName)
   * Used for dropdown population
   */
  async getActiveColors(): Promise<ColorMaster[]> {
    console.log('==================== DEBUG: colorService.getActiveColors() ====================');
    console.log('[colorService] Calling GET /api/admin/colors');
    console.log('[colorService] API_BASE_URL:', API_BASE_URL);
    console.log('[colorService] Full URL:', `${API_BASE_URL}/api/admin/colors`);
    console.log('[colorService] Token:', this.getToken() ? 'EXISTS' : 'MISSING');
    
    try {
      const response = await axios.get<ApiResponse<ColorMaster[]>>(
        `${API_BASE_URL}/api/admin/colors`,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
          },
        }
      );
      
      console.log('[colorService] Raw axios response:', response);
      console.log('[colorService] response.status:', response.status);
      console.log('[colorService] response.data:', response.data);
      console.log('[colorService] response.data.data:', response.data.data);
      console.log('[colorService] response.data.data type:', typeof response.data.data);
      console.log('[colorService] response.data.data is Array:', Array.isArray(response.data.data));
      
      if (response.data.data) {
        console.log('[colorService] response.data.data length:', response.data.data.length);
        console.log('[colorService] First 3 colors:', response.data.data.slice(0, 3));
      }
      
      const result = response.data.data || [];
      console.log('[colorService] Returning:', result.length, 'colors');
      console.log('==================== DEBUG END ====================');
      
      return result;
    } catch (error: any) {
      console.error('==================== DEBUG: colorService ERROR ====================');
      console.error('[colorService] Failed to fetch active colors:', error);
      console.error('[colorService] Error response:', error.response);
      console.error('[colorService] Error message:', error.message);
      console.error('==================== DEBUG END ====================');
      throw new Error(error.response?.data?.message || 'Failed to load colors');
    }
  }

  /**
   * Search active colors by query with pagination
   * Used for searchable dropdown
   */
  async searchActiveColors(query: string): Promise<ColorMaster[]> {
    console.log('==================== DEBUG: colorService.searchActiveColors() ====================');
    console.log('[colorService] Search query:', query);
    console.log('[colorService] Calling GET /api/admin/colors/search');
    console.log('[colorService] Full URL:', `${API_BASE_URL}/api/admin/colors/search?q=${query}`);
    
    try {
      const response = await axios.get<ApiResponse<ColorMaster[]>>(
        `${API_BASE_URL}/api/admin/colors/search`,
        {
          params: {
            q: query,
            page: 0,
            size: 50, // Get more results for dropdown
          },
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
          },
        }
      );
      
      console.log('[colorService] Raw axios response:', response);
      console.log('[colorService] response.status:', response.status);
      console.log('[colorService] response.data:', response.data);
      console.log('[colorService] response.data.data:', response.data.data);
      console.log('[colorService] response.data.data.content:', (response.data.data as any)?.content);
      
      if (response.data.data) {
        console.log('[colorService] response.data.data type:', typeof response.data.data);
        console.log('[colorService] response.data.data is Array:', Array.isArray(response.data.data));
        
        if (Array.isArray(response.data.data)) {
          console.log('[colorService] response.data.data length:', response.data.data.length);
          console.log('[colorService] Colors:', response.data.data);
        } else {
          console.log('[colorService] response.data.data is NOT an array!');
        }
      }
      
      // Handle both paginated and non-paginated responses
      const result = response.data.data || [];
      console.log('[colorService] Returning:', result.length, 'colors');
      console.log('==================== DEBUG END ====================');
      
      return result;
    } catch (error: any) {
      console.error('==================== DEBUG: colorService SEARCH ERROR ====================');
      console.error('[colorService] Failed to search colors:', error);
      console.error('[colorService] Error response:', error.response);
      console.error('[colorService] Error message:', error.message);
      console.error('==================== DEBUG END ====================');
      throw new Error(error.response?.data?.message || 'Failed to search colors');
    }
  }

  /**
   * Create a new color
   * POST /api/admin/colors
   */
  async createColor(data: {
    name: string;
    displayName: string;
    hexCode: string;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<ColorMaster> {
    console.log("Inside createColor()");
    console.log('==================== DEBUG: colorService.createColor() ====================');
    console.log('[colorService] Creating new color');
    console.log('[colorService] Input data:', data);
    console.log('[colorService] Request URL:', `${API_BASE_URL}/api/admin/colors`);
    console.log('[colorService] Request Method: POST');
    
    const payload = {
      name: data.name,
      displayName: data.displayName,
      hexCode: data.hexCode,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive !== false, // Default to true
    };
    console.log('[colorService] Request Payload:', payload);
    console.log('[colorService] Token:', this.getToken() ? 'EXISTS' : 'MISSING');
    
    try {
      const response = await axios.post<ApiResponse<ColorMaster>>(
        `${API_BASE_URL}/api/admin/colors`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('[colorService] Raw axios response:', response);
      console.log('[colorService] Response Status:', response.status);
      console.log('[colorService] Response Headers:', response.headers);
      console.log('[colorService] Response Body:', response.data);
      console.log('[colorService] Created Color:', response.data.data);
      console.log('==================== DEBUG END ====================');
      
      return response.data.data;
    } catch (error: any) {
      console.error('==================== DEBUG: colorService CREATE ERROR ====================');
      console.error('[colorService] Failed to create color:', error);
      console.error('[colorService] Error response:', error.response);
      console.error('[colorService] Error response status:', error.response?.status);
      console.error('[colorService] Error response data:', error.response?.data);
      console.error('[colorService] Error message:', error.message);
      console.error('==================== DEBUG END ====================');
      
      const message = error.response?.data?.message || error.message || 'Failed to create color';
      throw new Error(message);
    }
  }

  /**
   * Get authentication token from localStorage
   */
  private getToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('garja_admin_token') || '';
    }
    return '';
  }
}

export const colorService = new ColorService();
