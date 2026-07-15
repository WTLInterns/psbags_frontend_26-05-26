import { apiService } from '@/utils/api';
import { authStorage } from '@/utils/authStorage';

// ColorMaster DTO
export interface ColorMaster {
  id: number;
  name: string;
  displayName: string;
  hexCode: string | null;
  sortOrder: number;
  isActive: boolean;
}

// ProductColorImage DTO
export interface ProductColorImage {
  id: number;
  imageUrl: string;
  imagePublicId: string;
  altText: string | null;
  fileSize: number | null;
  mimeType: string | null;
  displayOrder: number;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ProductColor DTO
export interface ProductColor {
  id: number;
  colorMaster: ColorMaster;
  variantCode: string | null;
  displayOrder: number;
  images: ProductColorImage[];
  createdAt: string;
  updatedAt: string;
}

// Product type definition matching backend ProductDTO
export interface Product {
  id: number;
  productName: string;
  price: string;
  quantity: number;
  isActive: string; // Backend returns "1" or "0" as strings
  description: string;
  originalPrice?: string;
  discount?: string;
  XS?: string;
  M?: string;
  L?: string;
  XL?: string;
  XXL?: string;
  // Legacy image fields
  imageUrl?: string;
  imagePublicId?: string;
  imageUrl2?: string;
  imagePublicId2?: string;
  imageUrl3?: string;
  imagePublicId3?: string;
  imageUrl4?: string;
  imagePublicId4?: string;
  imageUrl5?: string;
  imagePublicId5?: string;
  category: string;
  subcategoryName?: string;
  date: string;
  time: string;
  shippingType?: string;
  shippingCost?: number;
  rating?: number;
  reviews?: any[];
  // Color variants
  hasVariants?: boolean;
  productColors?: ProductColor[];
}

// Product form data for creation/update
export interface ProductFormData {
  productName: string;
  price: string;
  quantity: number;
  isActive?: boolean | string;
  description: string;
  originalPrice?: string;
  discount?: string;
  XS?: string;
  M?: string;
  L?: string;
  XL?: string;
  XXL?: string;
  category: string;
  subcategoryName?: string;
  shippingType?: 'FREE' | 'PAID';
  shippingCost?: string;
  image?: File | null;
  image2?: File | null;
  image3?: File | null;
  image4?: File | null;
  image5?: File | null;
}

/**
 * Admin Product Service
 * All methods automatically include JWT token in headers via api.ts interceptor
 */
export const adminProductService = {
  /**
   * Get primary image URL for product card display
   * Returns primary image from primary color if color variants exist,
   * otherwise returns legacy imageUrl
   */
  getPrimaryImageUrl: (product: Product): string | null => {
    // If product has color variants, get primary color's primary image
    if (product.hasVariants && product.productColors && product.productColors.length > 0) {
      // Sort colors by displayOrder to find primary color (lowest displayOrder)
      const sortedColors = [...product.productColors].sort((a, b) => a.displayOrder - b.displayOrder);
      const primaryColor = sortedColors[0];
      
      if (primaryColor.images && primaryColor.images.length > 0) {
        // Find primary image
        const primaryImage = primaryColor.images.find(img => img.isPrimary && img.isActive);
        if (primaryImage) {
          return primaryImage.imageUrl;
        }
        
        // Fallback: return first active image sorted by displayOrder
        const sortedImages = [...primaryColor.images]
          .filter(img => img.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder);
        
        if (sortedImages.length > 0) {
          return sortedImages[0].imageUrl;
        }
      }
    }
    
    // Fallback to legacy imageUrl for backward compatibility
    return product.imageUrl || null;
  },

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
   * Get all products (Admin only)
   * JWT token is automatically attached via axios interceptor
   */
  getAllProducts: async (): Promise<Product[]> => {
    // Check admin role
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const products = await apiService.admin.getAllProducts();
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  /**
   * Get products by category (Admin only)
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const products = await apiService.admin.getProductsByCategory(category);
      return products;
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      throw error;
    }
  },

  /**
   * Get latest products (Admin only)
   */
  getLatestProducts: async (): Promise<Product[]> => {
  

    try {
      const products = await apiService.admin.getLatestProducts();
      return products;
    } catch (error) {
      console.error('Failed to fetch latest products:', error);
      throw error;
    }
  },

  /**
   * Get product by ID (Admin only)
   */
  getProductById: async (id: number): Promise<Product> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const product = await apiService.admin.getProductById(id);
      return product;
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      throw error;
    }
  },

  /**
   * Add new product (Admin only)
   */
  addProduct: async (formData: FormData): Promise<any> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      console.log("===== FINAL PRODUCT FORM DATA =====");
      const entries = Array.from(formData.entries());
      entries.forEach(([key, value]) => {
        if (key === 'colors') {
          console.log(key, ':', JSON.parse(value as string));
        } else {
          console.log(key, ':', value);
        }
      });
      console.log("Calling POST /api/admin/products");
      
      const response = await apiService.admin.addProduct(formData);
      return response;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },

  /**
   * Update existing product (Admin only)
   */
  updateProduct: async (id: number, formData: FormData): Promise<any> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      console.log("===== FINAL UPDATE PRODUCT FORM DATA =====");
      const entries = Array.from(formData.entries());
      entries.forEach(([key, value]) => {
        if (key === 'colors') {
          console.log(key, ':', JSON.parse(value as string));
        } else {
          console.log(key, ':', value);
        }
      });
      console.log("Calling PUT /api/admin/products/" + id);
      
      const response = await apiService.admin.updateProduct(id, formData);
      return response;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  /**
   * Delete product (Admin only)
   */
  deleteProduct: async (id: number): Promise<any> => {
    if (!adminProductService.checkAdminRole()) {
      throw new Error('Admin access required');
    }

    try {
      const response = await apiService.admin.deleteProduct(id);
      return response;
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },
};

// Example usage in a React component:
/*
import { adminProductService } from '@/services/adminProductService';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // JWT token is automatically included in the request
      const data = await adminProductService.getAllProducts();
      setProducts(data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setError('You do not have permission to view this page');
        // The auth:forbidden event will be dispatched by the interceptor
        // and handled by AdminAuthContext to clear admin session
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        // The auth:logout event will be dispatched by the interceptor
      } else {
        setError('Failed to load products');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminProductService.deleteProduct(id);
        // Reload products after successful deletion
        await loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  // ... rest of component
};
*/

export default adminProductService;
