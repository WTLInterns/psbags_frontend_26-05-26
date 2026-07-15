// PHASE 4: Color Variant Types for Customer Frontend
export interface ProductColor {
  id: string;
  colorMasterId: number;
  colorName: string;
  colorDisplayName: string;
  hexCode?: string;
  variantCode?: string;
  displayOrder: number;
  images: ProductColorImage[];
}

export interface ProductColorImage {
  id: string;
  imageUrl: string;
  imagePublicId: string;
  altText?: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: 'shop online' | 'corporate gifts' | 'wholesale / distributor' | string;
  subcategoryName?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  shippingType?: 'FREE' | 'PAID';
  shippingCost?: number;
  createdAt: string;
  updatedAt: string;
  // PHASE 4: Color Variant Support
  hasVariants?: boolean;
  productColors?: ProductColor[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  addedAt: string;
  // PHASE 4: Color Variant Support
  selectedColorId?: number;
  selectedVariantCode?: string;
  selectedColorImage?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating' | 'newest';
}
