import { apiService } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';

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

// Blog form data for creation/update
export interface BlogFormData {
  title: string;
  description: string;
  isActive?: boolean | string;
  thumbnail?: File | null; // Actual file for upload
  video?: File | null; // Actual file for upload
  thumbnailPreview?: string; // Preview URL for display
  videoPreview?: string; // Preview URL for display
}

/**
 * Admin Blog Service
 * All methods automatically include JWT token in headers via api.ts interceptor
 */
export const adminBlogService = {
  /**
   * Check if user has admin role before making requests
   */
  checkAdminRole: (): boolean => {
    const isAdmin = authStorage.isAdminAuthenticated();
    
    if (!isAdmin) {
      console.error('Admin access required - user is not authenticated as admin');
    }
    
    return isAdmin;
  },

  /**
   * Get all blogs (Admin only)
   * JWT token is automatically attached via axios interceptor
   */
  getAllBlogs: async (): Promise<Blog[]> => {
    // Check admin role
    if (!adminBlogService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const blogs = await apiService.admin.getAllBlogs();
      return blogs;
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      throw error;
    }
  },

  /**
   * Add new blog (Admin only)
   */
  addBlog: async (blogData: BlogFormData): Promise<any> => {
    if (!adminBlogService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      // Create FormData object for multipart/form-data
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('description', blogData.description);
      
      if (blogData.isActive !== undefined) {
        formData.append('isActive', blogData.isActive.toString());
      }
      
      // Add thumbnail if provided
      if (blogData.thumbnail) {
        formData.append('thumbnail', blogData.thumbnail);
      }
      
      // Add video if provided
      if (blogData.video) {
        formData.append('video', blogData.video);
      }

      console.log('ADD BLOG - Thumbnail:', blogData.thumbnail);
      console.log('ADD BLOG - Video:', blogData.video);
      
      const response = await apiService.admin.addBlog(formData);
      return response;
    } catch (error) {
      console.error('Failed to add blog:', error);
      throw error;
    }
  },

  /**
   * Update existing blog (Admin only)
   */
  updateBlog: async (id: number, blogData: BlogFormData): Promise<any> => {
    if (!adminBlogService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('description', blogData.description);
      
      if (blogData.isActive !== undefined) {
        formData.append('isActive', blogData.isActive.toString());
      }
      
      // Add thumbnail if provided (optional for update)
      if (blogData.thumbnail) {
        formData.append('thumbnail', blogData.thumbnail);
      }
      
      // Add video if provided (optional for update)
      if (blogData.video) {
        formData.append('video', blogData.video);
      }

      console.log('UPDATE BLOG - Thumbnail:', blogData.thumbnail);
      console.log('UPDATE BLOG - Video:', blogData.video);
      
      const response = await apiService.admin.updateBlog(id, formData);
      return response;
    } catch (error) {
      console.error('Failed to update blog:', error);
      throw error;
    }
  },

  /**
   * Delete blog (Admin only)
   */
  deleteBlog: async (id: number): Promise<any> => {
    if (!adminBlogService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const response = await apiService.admin.deleteBlog(id);
      return response;
    } catch (error) {
      console.error('Failed to delete blog:', error);
      throw error;
    }
  },
};

export default adminBlogService;