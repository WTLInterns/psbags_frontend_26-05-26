import { apiService } from '@/utils/api';

// Blog type definition matching backend API response
export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
  isActive: string; // "1" or "0" as strings (matching backend)
  date: string;
  time: string;
}

/**
 * Public Blog Service for frontend consumption
 * No authentication required for public endpoints
 */
export const blogService = {
  /**
   * Get all active blogs
   */
  getAllBlogs: async (): Promise<Blog[]> => {
    try {
      const response = await apiService.get('/public/blogs');
      return response || [];
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      throw error;
    }
  },

  /**
   * Get latest blog post
   */
  getLatestBlog: async (): Promise<Blog | null> => {
    try {
      const response = await apiService.get('/public/blogs/latest');
      return response || null;
    } catch (error) {
      console.error('Failed to fetch latest blog:', error);
      throw error;
    }
  },

  /**
   * Get blog by slug
   */
  getBlogBySlug: async (slug: string): Promise<Blog | null> => {
    try {
      const response = await apiService.get(`/public/blogs/${slug}`);
      return response || null;
    } catch (error) {
      console.error('Failed to fetch blog by slug:', error);
      throw error;
    }
  },

  /**
   * Get related blogs (excluding current blog)
   */
  getRelatedBlogs: async (currentId: number, limit: number = 3): Promise<Blog[]> => {
    try {
      const allBlogs = await blogService.getAllBlogs();
      return allBlogs
        .filter(blog => blog.id !== currentId)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch related blogs:', error);
      return [];
    }
  },
};

export default blogService;