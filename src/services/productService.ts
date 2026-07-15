import axios from 'axios';
import { API_BASE_URL } from '@/utils/apiConfig';

const API_URL = API_BASE_URL;

// Product type based on actual API response
export interface ApiProduct {
  id: number;
  productName: string;
  price: string;
  quantity: number;
  isActive: string;
  description: string | null;
  originalPrice?: string | number | null;
  discount?: string | number | null;
  rating?: number | null; // PHASE 4: Backend rating field
  XS?: string;
  M?: string;
  L?: string;
  XL?: string;
  XXL?: string;
  xs?: string | null;
  m?: string | null;
  l?: string | null;
  xl?: string | null;
  xxl?: string | null;
  imageUrl: string;
  imagePublicId?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
  category: string;
  subcategoryName?: string;
  date?: string;
  time?: string;
  shippingType?: string;
  shippingCost?: number | null;
  reviews?: any[];
  // PHASE 4: Color Variant Support
  hasVariants?: boolean;
  productColors?: ApiProductColor[];
}

// PHASE 4: Backend Color Variant Structure
export interface ApiProductColor {
  id: number;
  colorMasterId: number;
  variantCode?: string | null;
  displayOrder: number;
  colorMaster: {
    id: number;
    name: string;
    displayName: string;
    hexCode?: string | null;
  };
  images: ApiProductColorImage[];
}

export interface ApiProductColorImage {
  id: number;
  imageUrl: string;
  imagePublicId: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

// Import the Product type from types
import { Product } from '@/types/product';

// Map category to match frontend categories
const mapCategory = (apiCategory: string): Product['category'] => {
  const categoryMap: { [key: string]: Product['category'] } = {
    'apparel': 't-shirts',
    't-shirt': 't-shirts',
    't-shirts': 't-shirts',
    'tshirts': 't-shirts',
    'hoodie': 'hoodies',
    'hoodies': 'hoodies',
    'shirt': 'shirts',
    'shirts': 'shirts',
    'jacket': 'jackets',
    'jackets': 'jackets',
    'pant': 'pants',
    'pants': 'pants',
    'jean': 'jeans',
    'jeans': 'jeans',
    'short': 'shorts',
    'shorts': 'shorts',
    'sweater': 'sweaters',
    'sweaters': 'sweaters',
    'shop online': 'shop online',
    'corporate gifts': 'corporate gifts',
    'wholesale / distributor': 'wholesale / distributor',
  };
  
  const lowercaseCategory = apiCategory.toLowerCase();
  return categoryMap[lowercaseCategory] || apiCategory;
};

// Convert API product to frontend format
const transformProduct = (apiProduct: ApiProduct): Product => {
  // Extract available sizes based on stock
  const sizes: string[] = [];
  const hasQty = (v?: string | null) => {
    if (v === null || v === undefined) return false;
    const n = parseInt(String(v));
    return !isNaN(n) && n > 0;
  };
  if (hasQty(apiProduct.XS) || hasQty(apiProduct.xs)) sizes.push('XS');
  if (hasQty(apiProduct.M) || hasQty(apiProduct.m)) sizes.push('M');
  if (hasQty(apiProduct.L) || hasQty(apiProduct.l)) sizes.push('L');
  if (hasQty(apiProduct.XL) || hasQty(apiProduct.xl)) sizes.push('XL');
  if (hasQty(apiProduct.XXL) || hasQty(apiProduct.xxl)) sizes.push('XXL');
  
  // If no sizes are specified, default to common sizes
  if (sizes.length === 0) {
    sizes.push('M', 'L', 'XL');
  }

  // Parse price (remove any non-numeric characters)
  const price = parseFloat(String(apiProduct.price).replace(/[^0-9.]/g, ''));
  // Parse original price if provided by backend
  const parsedOriginal = apiProduct.originalPrice !== undefined && apiProduct.originalPrice !== null
    ? parseFloat(String(apiProduct.originalPrice).replace(/[^0-9.]/g, ''))
    : undefined;
  const originalPrice = isFinite(parsedOriginal as number) && (parsedOriginal as number) > 0 ? (parsedOriginal as number) : undefined;
  // Determine discount percent from backend or compute from prices
  const parsedBackendDiscount = apiProduct.discount !== undefined && apiProduct.discount !== null
    ? parseFloat(String(apiProduct.discount).replace(/[^0-9.]/g, ''))
    : undefined;
  const computedDiscount = originalPrice && isFinite(price) && originalPrice > 0
    ? Math.max(0, Math.min(100, ((originalPrice - price) / originalPrice) * 100))
    : undefined;
  const discountPercent = isFinite(parsedBackendDiscount as number)
    ? (parsedBackendDiscount as number)
    : (computedDiscount !== undefined ? Math.round(computedDiscount) : undefined);
  
  // PHASE 4: Handle color variants or fallback to old system
  const hasVariants = apiProduct.hasVariants === true && apiProduct.productColors && apiProduct.productColors.length > 0;
  
  let images: string[];
  let colors: string[];
  let productColors: Product['productColors'];
  
  if (hasVariants && apiProduct.productColors) {
    // NEW: Use color variant system
    productColors = apiProduct.productColors
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(colorVariant => ({
        id: colorVariant.id.toString(),
        colorMasterId: colorVariant.colorMasterId,
        colorName: colorVariant.colorMaster.name,
        colorDisplayName: colorVariant.colorMaster.displayName,
        hexCode: colorVariant.colorMaster.hexCode || undefined,
        variantCode: colorVariant.variantCode || undefined,
        displayOrder: colorVariant.displayOrder,
        images: colorVariant.images
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(img => ({
            id: img.id.toString(),
            imageUrl: img.imageUrl,
            imagePublicId: img.imagePublicId,
            altText: img.altText || undefined,
            displayOrder: img.displayOrder,
            isPrimary: img.isPrimary
          }))
      }));
    
    // Extract images from first color's images for backward compatibility
    const firstColor = productColors[0];
    images = firstColor.images.map(img => img.imageUrl);
    
    // Extract color names for backward compatibility
    colors = productColors.map(c => c.colorDisplayName);
  } else {
    // OLD: Use legacy image system
    const rawImages = [
      apiProduct.imageUrl,
      apiProduct.imageUrl2,
      apiProduct.imageUrl3,
      apiProduct.imageUrl4,
      apiProduct.imageUrl5,
    ].filter((url): url is string => typeof url === 'string' && url.trim() !== '');
    images = rawImages.length > 0 ? rawImages : ['/images/placeholder.jpg'];
    
    // Default colors (since API doesn't provide colors)
    colors = ['Black', 'White', 'Navy', 'Gray'];
    productColors = undefined;
  }
  
  // Generate tags based on category and name
  const tags = [
    apiProduct.category,
    'new arrival',
    (apiProduct.isActive === 'true' || apiProduct.isActive === '1') ? 'in stock' : 'out of stock'
  ];
  
  const createdAt = apiProduct.date && apiProduct.time ? `${apiProduct.date} ${apiProduct.time}` : new Date().toISOString();
  
  // PHASE 4: Use backend rating if available
  const rating = apiProduct.rating && typeof apiProduct.rating === 'number' && apiProduct.rating >= 0 && apiProduct.rating <= 5
    ? apiProduct.rating
    : 4.5; // Default fallback

  console.log('IMAGE URL 1:', apiProduct.imageUrl);
  console.log('IMAGE URL 2:', apiProduct.imageUrl2);
  console.log('IMAGE URL 3:', apiProduct.imageUrl3);
  console.log('IMAGE URL 4:', apiProduct.imageUrl4);
  console.log('IMAGE URL 5:', apiProduct.imageUrl5);
  console.log('HAS VARIANTS:', hasVariants);
  console.log('PRODUCT COLORS:', productColors);
  console.log('FINAL IMAGES ARRAY:', images);

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.productName,
    price: price,
    originalPrice: originalPrice,
    discountPercent: discountPercent,
    description: apiProduct.description || '',
    category: mapCategory(apiProduct.category),
    subcategoryName: apiProduct.subcategoryName,
    images: images,
    sizes: sizes,
    colors: colors,
    inStock: (apiProduct.isActive === 'true' || apiProduct.isActive === '1') && apiProduct.quantity > 0,
    stockQuantity: apiProduct.quantity,
    rating: rating,
    reviewCount: apiProduct.reviews?.length || 0,
    tags: tags,
    shippingType: (apiProduct.shippingType === 'PAID' ? 'PAID' : 'FREE') as 'FREE' | 'PAID',
    shippingCost: apiProduct.shippingCost != null ? Number(apiProduct.shippingCost) : 0,
    createdAt: createdAt,
    updatedAt: createdAt,
    // PHASE 4: Color Variant fields
    hasVariants: hasVariants,
    productColors: productColors
  };
};

/**
 * Product Service using real public API endpoints
 */
export const productService = {
  /**
   * Get all products from public API
   */
  getAllProducts: async (): Promise<Product[]> => {
    try {
      console.log('Fetching all products from:', `${API_URL}/public/getAllProducts`);
      const response = await axios.get(`${API_URL}/public/getAllProducts`);
      const products: ApiProduct[] = response.data;
      return products.map(transformProduct);
    } catch (error: any) {
      console.error('Error fetching all products:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      // Return mock data as fallback for development
      return getMockProducts();
    }
  },

  /**
   * Get products by category from public API
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      // Normalize frontend category to what backend expects
      const toBackendCategory = (c: string) => {
        const v = c.trim().toLowerCase();
        if (v === 'hoodies' || v === 'hoodie') return 'Hoodie';
        // DB stores TShirts (capital S) -> send exactly that to backend
        if (v === 't-shirts' || v === 'tshirt' || v === 'tshirts') return 'TShirts';
        if (v === 'jeans' || v === 'jean') return 'jeans';
        if (v === 'jackets' || v === 'jacket') return 'jackets';
        if (v === 'shirts' || v === 'shirt') return 'shirts';
        if (v === 'pants' || v === 'pant') return 'pants';
        if (v === 'shorts' || v === 'short') return 'shorts';
        if (v === 'sweaters' || v === 'sweater') return 'sweaters';
        return c;
      };

      const desiredFrontendCategory = mapCategory(category);
      const backendCategory = toBackendCategory(category);

      const response = await axios.get(`${API_URL}/public/getProductByCategory`, {
        params: { category: backendCategory }
      });
      const products: ApiProduct[] = response.data;
      // Transform and ensure consistent frontend filtering
      const transformed = products.map(transformProduct);
      const filtered = transformed.filter(p => p.category === desiredFrontendCategory);
      return filtered.length > 0 ? filtered : transformed;
    } catch (error: any) {
      console.error('Failed to fetch products by category:', error);
      // Fallback to filtering all products
      const allProducts = await productService.getAllProducts();
      const desiredFrontendCategory = mapCategory(category);
      return allProducts.filter(p => p.category === desiredFrontendCategory);
    }
  },

  /**
   * Get latest products from public API
   */
  getLatestProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get(`${API_URL}/public/getLatestProducts`);
      const products: ApiProduct[] = response.data;
      console.log(products);
      return products.map(transformProduct);
    } catch (error: any) {
      console.error('Error fetching latest products:', error);
      // Fallback to first 3 products
      const allProducts = await productService.getAllProducts();
      return allProducts.slice(0, 3);
    }
  },

  /**
   * Get single product by ID from public API
   */
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      console.log(`Fetching product by ID: ${id}`);
      const response = await axios.get(`${API_URL}/public/getProductById/${id}`);
      const product: ApiProduct = response.data;
      return transformProduct(product);
    } catch (error: any) {
      console.error('Failed to fetch product:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      // Fallback to filtering from all products
      const products = await productService.getAllProducts();
      const product = products.find(p => p.id === id);
      return product || null;
    }
  },

  /**
   * Get products by subcategory from public API
   */
  getProductsBySubcategory: async (subcategoryName: string): Promise<Product[]> => {
    try {
      console.log('API Called: GET /public/getProductBySubcategory?subcategoryName=', subcategoryName);
      const response = await axios.get(`${API_URL}/public/getProductBySubcategory`, {
        params: { subcategoryName }
      });
      const products: ApiProduct[] = response.data;
      console.log('Products Returned:', products.length);
      console.log('Returned Product Subcategories:', products.map(p => p.subcategoryName));
      return products.map(transformProduct);
    } catch (error: any) {
      console.error('Failed to fetch products by subcategory:', error);
      // Fallback: filter all products by subcategoryName field
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(p =>
        p.subcategoryName?.toLowerCase() === subcategoryName.toLowerCase()
      );
    }
  },
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const products = await productService.getAllProducts();
      const searchTerm = query.toLowerCase();
      return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  },
  getLatestProductsBySubcategory: async (category?: string): Promise<Product[]> => {
    try {
      console.log(`Fetching latest products by subcategory for category: ${category || 'all'}`);
      const response = await axios.get(`${API_URL}/api/products/latest-by-subcategory`, {
        params: { category }
      });
      const products: ApiProduct[] = response.data;
      return products.map(transformProduct);
    } catch (error: any) {
      console.error('Error fetching latest products by subcategory:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      return [];
    }
  },
};

// These are placeholders - you need to implement these in your backend
export const publicProductService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch('http://localhost:8086/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.map(transformProduct);
    } catch (error) {
      console.warn('Public API not available, using fallback');
      return getMockProducts();
    }
  },
};

// Mock data fallback for development
export function getMockProducts(): Product[] {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      name: 'Classic White T-Shirt',
      price: 1299,
      originalPrice: 1599,
      description: 'Premium cotton t-shirt with a classic fit',
      category: 't-shirts',
      images: ['/images/products/tshirt1.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Gray'],
      inStock: true,
      stockQuantity: 50,
      rating: 4.5,
      reviewCount: 128,
      tags: ['new-arrival', 'bestseller', 'cotton'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: '2',
      name: 'Denim Jacket',
      price: 3499,
      originalPrice: 4999,
      description: 'Stylish denim jacket for all seasons',
      category: 'jackets',
      images: ['/images/products/jacket1.jpg'],
      sizes: ['M', 'L', 'XL'],
      colors: ['Blue', 'Black'],
      inStock: true,
      stockQuantity: 25,
      rating: 4.7,
      reviewCount: 89,
      tags: ['premium', 'denim', 'trending'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: '3',
      name: 'Casual Hoodie',
      price: 2499,
      originalPrice: 2999,
      description: 'Comfortable hoodie perfect for casual wear',
      category: 'hoodies',
      images: ['/images/products/hoodie1.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Gray', 'Navy'],
      inStock: true,
      stockQuantity: 75,
      rating: 4.8,
      reviewCount: 256,
      tags: ['comfort', 'casual', 'winter'],
      createdAt: now,
      updatedAt: now
    }
  ];
}

export default productService;
