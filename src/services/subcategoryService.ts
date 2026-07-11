import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086';

export interface Subcategory {
  id: number;
  categoryName: string;
  subcategoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryRequest {
  categoryName: string;
  subcategoryName: string;
}

export const subcategoryService = {
  // Admin APIs
  createSubcategory: async (request: SubcategoryRequest): Promise<Subcategory> => {
    const response = await axios.post(`${API_URL}/admin/subcategory`, request);
    return response.data;
  },

  getAllSubcategories: async (): Promise<Subcategory[]> => {
    const response = await axios.get(`${API_URL}/admin/subcategory`);
    return response.data;
  },

  updateSubcategory: async (id: number, request: SubcategoryRequest): Promise<Subcategory> => {
    const response = await axios.put(`${API_URL}/admin/subcategory/${id}`, request);
    return response.data;
  },

  deleteSubcategory: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/admin/subcategory/${id}`);
  },

  // Public APIs
  getSubcategoriesByCategory: async (category: string): Promise<Subcategory[]> => {
    const response = await axios.get(`${API_URL}/public/subcategory`, {
      params: { category }
    });
    return response.data;
  }
};

export default subcategoryService;