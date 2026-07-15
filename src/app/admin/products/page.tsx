'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminProductService, Product as ServiceProduct } from '@/services/adminProductService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import AddSubcategoryModal from '@/components/admin/AddSubcategoryModal';
import SubcategoryManagement from '@/components/admin/SubcategoryManagement';
import { subcategoryService, Subcategory } from '@/services/subcategoryService';
import { colorService } from '@/services/colorService';
import { ColorMaster, ColorImage } from '@/types/colorTypes';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: string;
  discount:string
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: string;
  discount:string
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
  createdAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subcategoryName: string;
  price: string;
  stock: string;
  originalPrice: string;
  discount: string;
  rating: string;
  isActive: boolean;
  shippingType: 'FREE' | 'PAID';
  shippingCost: string;
  xs: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
  // PRODUCTION FIX: Simplified color selection
  selectedColors: ColorMaster[]; // Multi-select colors
  colorImages: { [colorId: number]: ColorImage[] }; // Images per color
}

const ProductsPage = () => {
  const { isAuthenticated, admin, isLoading: isAuthLoading } = useAdminAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showSubcategoryManagement, setShowSubcategoryManagement] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  
  // PRODUCTION: Color management state (connected to backend)
  const [availableColors, setAvailableColors] = useState<ColorMaster[]>([]);
  const [colorSearchTerm, setColorSearchTerm] = useState<string>('');
  const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false);
  const [isLoadingColors, setIsLoadingColors] = useState<boolean>(false);
  const [colorSearchError, setColorSearchError] = useState<string | null>(null);
  const [newColorInput, setNewColorInput] = useState<string>('');

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    subcategoryName: '',
    price: '',
    stock: '',
    isActive: true,
    shippingType: 'FREE',
    shippingCost: '0',
    originalPrice:'',
    discount:'',
    rating: '', // PHASE 1: Rating field
    xs: '0',
    m: '0',
    l: '0',
    xl: '0',
    xxl: '0',
    selectedColors: [], // PRODUCTION FIX: Multi-select colors
    colorImages: {} // PRODUCTION FIX: Images per color
  });

  // Products data from API
  const [products, setProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<ServiceProduct[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  // Transform API product to local Product format
  const transformApiProduct = (apiProduct: ServiceProduct): Product => {
    // Check isActive field - it comes as "1" or "0" string from backend
    const isActive = apiProduct.isActive === "1";
    
    // Get primary image URL using the helper function
    const primaryImageUrl = adminProductService.getPrimaryImageUrl(apiProduct);
    
    return {
      id: apiProduct.id.toString(),
      name: apiProduct.productName,
      description: apiProduct.description,
      category: apiProduct.category,
      price: parseFloat(apiProduct.price),
      originalPrice: apiProduct.originalPrice || '',
      discount: apiProduct.discount || '',
      stock: apiProduct.quantity,
      status: isActive ? 'active' : 'inactive',
      image: primaryImageUrl || '', // Use primary image from color variants or fallback
      createdAt: apiProduct.date
    };
  };

  // Load products from API
  useEffect(() => {
    // Wait for auth check to complete
    if (isAuthLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to admin login');
      router.push('/admin');
      return;
    }

    loadProducts();
    loadSubcategories();
    loadColors(); // PRODUCTION: Load colors from backend
  }, [isAuthenticated, isAuthLoading, router]);
  
  // PRODUCTION: Load colors from backend
  const loadColors = async () => {
    console.log('==================== DEBUG: loadColors() ====================');
    console.log('[page.tsx] Loading colors...');
    
    try {
      setIsLoadingColors(true);
      setColorSearchError(null);
      
      console.log('[page.tsx] Calling colorService.getActiveColors()...');
      const colors = await colorService.getActiveColors();
      
      console.log('[page.tsx] colorService.getActiveColors() returned:', colors);
      console.log('[page.tsx] Colors count:', colors.length);
      console.log('[page.tsx] Colors:', colors);
      
      setAvailableColors(colors);
      console.log('[page.tsx] setAvailableColors() called with', colors.length, 'colors');
      console.log('==================== DEBUG END ====================');
    } catch (error: any) {
      console.error('==================== DEBUG: loadColors ERROR ====================');
      console.error('[page.tsx] Failed to load colors:', error);
      console.error('[page.tsx] Error message:', error.message);
      setColorSearchError('Failed to load colors');
      setAvailableColors([]);
      console.error('==================== DEBUG END ====================');
    } finally {
      setIsLoadingColors(false);
      console.log('[page.tsx] loadColors() complete. isLoadingColors set to false');
    }
  };
  
  // PRODUCTION: Color name to hex code mapping
  const getHexCodeForColorName = (colorName: string): string => {
    const name = colorName.toLowerCase().trim();
    const colorMap: { [key: string]: string } = {
      'red': '#FF0000',
      'green': '#008000',
      'blue': '#0000FF',
      'black': '#000000',
      'white': '#FFFFFF',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'gray': '#808080',
      'grey': '#808080',
      'cyan': '#00FFFF',
      'magenta': '#FF00FF',
      'lime': '#00FF00',
      'navy': '#000080',
      'teal': '#008080',
      'maroon': '#800000',
      'olive': '#808000',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'beige': '#F5F5DC',
      'cream': '#FFFDD0',
      'ivory': '#FFFFF0',
      'lavender': '#E6E6FA',
      'indigo': '#4B0082',
      'violet': '#EE82EE',
      'turquoise': '#40E0D0',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      'crimson': '#DC143C',
      'scarlet': '#FF2400',
      'burgundy': '#800020',
      'plum': '#DDA0DD',
      'khaki': '#F0E68C',
      'tan': '#D2B48C',
      'charcoal': '#36454F',
      'midnight black': '#000000',
      'navy blue': '#000080',
      'sky blue': '#87CEEB',
      'royal blue': '#4169E1',
      'baby blue': '#89CFF0',
      'forest green': '#228B22',
      'mint green': '#98FF98',
      'olive green': '#808000',
      'dark green': '#006400',
      'light green': '#90EE90',
      'hot pink': '#FF69B4',
      'dark pink': '#E75480',
      'light pink': '#FFB6C1',
      'cherry red': '#DE3163',
      'brick red': '#B22222',
      'fire engine red': '#CE2029',
      'copper': '#B87333',
      'bronze': '#CD7F32',
      'metallic': '#C0C0C0',
    };
    
    // Try exact match first
    if (colorMap[name]) {
      return colorMap[name];
    }
    
    // Try partial match
    for (const [key, value] of Object.entries(colorMap)) {
      if (name.includes(key) || key.includes(name)) {
        return value;
      }
    }
    
    // Default to gray if no match found
    return '#808080';
  };

  // PRODUCTION: Create a new color
  const handleCreateColor = async () => {
    console.log("handleCreateColor START");
    console.log('==================== DEBUG: handleCreateColor() ====================');
    console.log('[handleCreateColor] Add Color button clicked');
    console.log('[handleCreateColor] newColorInput:', newColorInput);
    
    const colorName = newColorInput.trim();
    console.log('[handleCreateColor] Color Name (trimmed):', colorName);
    
    if (!colorName) {
      console.log('[handleCreateColor] Validation failed: empty color name');
      showNotification('error', 'Please enter a color name');
      return;
    }
    
    try {
      console.log('[handleCreateColor] Setting isLoadingColors to true');
      setIsLoadingColors(true);
      setColorSearchError(null);
      
      // Create color with proper hex code based on color name
      const hexCode = getHexCodeForColorName(colorName);
      console.log('[handleCreateColor] Generated hexCode:', hexCode);
      
      const createPayload = {
        name: colorName.toLowerCase().replace(/\s+/g, '-'),
        displayName: colorName,
        hexCode: hexCode,
        sortOrder: 0,
        isActive: true,
      };
      console.log('[handleCreateColor] Payload to send:', createPayload);
      console.log('[handleCreateColor] Calling colorService.createColor()...');
      console.log("Calling createColor API");
      
      const newColor = await colorService.createColor(createPayload);
      
      console.log('[handleCreateColor] colorService.createColor() returned successfully');
      console.log('[handleCreateColor] New color received:', newColor);
      
      showNotification('success', `Color "${newColor.displayName}" created successfully!`);
      
      console.log('[handleCreateColor] Reloading colors list...');
      // Reload colors immediately
      await loadColors();
      console.log('[handleCreateColor] Colors reloaded successfully');
      
      // Clear input
      setNewColorInput('');
      
      // Open dropdown to show the new color
      setShowColorDropdown(true);
      setColorSearchTerm('');
      
      console.log('[handleCreateColor] Success! Add Color flow complete');
      console.log('==================== DEBUG END ====================');
      
    } catch (error: any) {
      console.error('==================== DEBUG: handleCreateColor ERROR ====================');
      console.error('[handleCreateColor] Failed to create color:', error);
      console.error('[handleCreateColor] Error message:', error.message);
      console.error('[handleCreateColor] Error stack:', error.stack);
      console.error('==================== DEBUG END ====================');
      showNotification('error', error.message || 'Failed to create color');
    } finally {
      console.log('[handleCreateColor] Setting isLoadingColors to false');
      setIsLoadingColors(false);
    }
  };
  
  // PRODUCTION: Debounced color search (300ms)
  useEffect(() => {
    console.log('==================== DEBUG: Search useEffect ====================');
    console.log('[page.tsx] showColorDropdown:', showColorDropdown);
    console.log('[page.tsx] colorSearchTerm:', colorSearchTerm);
    
    if (!showColorDropdown) {
      // Dropdown not open, no need to search
      console.log('[page.tsx] Dropdown not open, skipping search');
      console.log('==================== DEBUG END ====================');
      return;
    }
    
    const searchColors = async () => {
      console.log('[page.tsx] searchColors() executing...');
      console.log('[page.tsx] colorSearchTerm:', colorSearchTerm);
      
      try {
        setIsLoadingColors(true);
        setColorSearchError(null);
        console.log('[page.tsx] isLoadingColors set to true');
        
        if (!colorSearchTerm.trim()) {
          // Empty search, load all active colors
          console.log('[page.tsx] Empty search term - loading all active colors');
          const colors = await colorService.getActiveColors();
          console.log('[page.tsx] getActiveColors returned:', colors.length, 'colors');
          setAvailableColors(colors);
          console.log('[page.tsx] setAvailableColors called with:', colors);
        } else {
          // Search with query
          console.log('[page.tsx] Searching with query:', colorSearchTerm);
          const colors = await colorService.searchActiveColors(colorSearchTerm);
          console.log('[page.tsx] searchActiveColors returned:', colors.length, 'colors');
          console.log('[page.tsx] Colors:', colors);
          setAvailableColors(colors);
          console.log('[page.tsx] setAvailableColors called with:', colors);
        }
      } catch (error: any) {
        console.error('==================== DEBUG: Search ERROR ====================');
        console.error('[page.tsx] Failed to search colors:', error);
        console.error('[page.tsx] Error message:', error.message);
        setColorSearchError(error.message || 'Search failed');
        setAvailableColors([]);
        console.error('==================== DEBUG END ====================');
      } finally {
        setIsLoadingColors(false);
        console.log('[page.tsx] searchColors complete. isLoadingColors set to false');
      }
    };
    
    // Debounce: Wait 300ms before searching
    console.log('[page.tsx] Setting debounce timer (300ms)...');
    const debounceTimer = setTimeout(() => {
      console.log('[page.tsx] Debounce timer fired, calling searchColors()');
      searchColors();
    }, 300);
    
    return () => {
      console.log('[page.tsx] Clearing debounce timer');
      clearTimeout(debounceTimer);
    };
  }, [colorSearchTerm, showColorDropdown]);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      loadSubcategoriesForCategory(formData.category);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category]);

  const loadSubcategories = async () => {
    try {
      const data = await subcategoryService.getAllSubcategories();
      setSubcategories(data);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
    }
  };

  const loadSubcategoriesForCategory = async (categoryName: string) => {
    try {
      const data = await subcategoryService.getSubcategoriesByCategory(categoryName);
      setFilteredSubcategories(data);
    } catch (error) {
      console.error('Failed to load subcategories for category:', error);
      setFilteredSubcategories([]);
    }
  };

  const loadProducts = async () => {
    try {
      const fetchedProducts = await adminProductService.getAllProducts();
      setApiProducts(fetchedProducts);
      const transformedProducts = fetchedProducts.map(transformApiProduct);
      setProducts(transformedProducts);
      
      // Also fetch latest products for "Latest" category
      try {
        const fetchedLatestProducts = await adminProductService.getLatestProducts();
        const transformedLatestProducts = fetchedLatestProducts.map(transformApiProduct);
        setLatestProducts(transformedLatestProducts);
      } catch (latestError) {
        console.warn('Failed to load latest products:', latestError);
        // Don't block UI if latest fails
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      // Do NOT redirect from here to prevent unexpected navigation during CRUD.
      // Rely on AdminAuthContext for auth enforcement.
      if (error.response?.status === 500) {
        showNotification('error', 'Admin server error. Please try again later.');
      } else if (error.response?.status === 404) {
        showNotification('error', 'Products not found');
      } else if (error.response?.status === 403) {
        showNotification('error', 'You do not have permission to view products');
      } else if (error.response?.status === 401) {
        showNotification('error', 'Your session may have expired. Please refresh or login again.');
      } else {
        showNotification('error', error.message || 'Failed to load products. Please try again.');
      }
    } finally {
      // Keep UI responsive: do not show blocking loader
      setIsLoadingProducts(false);
    }
  };

  const categories = ['all', 'Latest', 'Shop Online', 'Corporate Gifts', 'Wholesale / Distributor'];

  const getProductsToDisplay = () => {
    let productsToFilter = selectedCategory === 'Latest' ? latestProducts : products;
    
    return productsToFilter.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || selectedCategory === 'Latest' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  };
  
  const filteredProducts = getProductsToDisplay();

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStockColor = (stock: number) => {
    if (stock > 20) return 'text-green-600';
    if (stock > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper functions
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate discount percentage string from original and current price
  const calculateDiscount = (original: string, price: string): string => {
    const op = parseFloat(original);
    const p = parseFloat(price);
    if (!isFinite(op) || !isFinite(p) || op <= 0) return '';
    const pct = ((op - p) / op) * 100;
    // Clamp between 0 and 100 and format to 0 decimals
    const clamped = Math.max(0, Math.min(100, pct));
    return clamped.toFixed(0);
  };

  const resetForm = () => {
    // PRODUCTION FIX: Cleanup all object URLs before resetting
    Object.values(formData.colorImages).forEach(images => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    });
    
    setFormData({
      name: '',
      description: '',
      category: '',
      subcategoryName: '',
      price: '',
      stock: '',
      originalPrice:'',
      discount:'',
      rating: '', // PHASE 1: Reset rating
      isActive: true,
      shippingType: 'FREE',
      shippingCost: '0',
      xs: '0',
      m: '0',
      l: '0',
      xl: '0',
      xxl: '0',
      selectedColors: [], // PRODUCTION FIX: Reset selected colors
      colorImages: {} // PRODUCTION FIX: Reset color images
    });
    setFilteredSubcategories([]);
    setColorSearchTerm(''); // PRODUCTION: Reset color search
    setShowColorDropdown(false); // PRODUCTION: Reset color dropdown
    setColorSearchError(null); // PRODUCTION: Reset error
    setNewColorInput(''); // PRODUCTION: Reset new color input
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showNotification('error', 'Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      showNotification('error', 'Product description is required');
      return false;
    }
    if (!formData.category) {
      showNotification('error', 'Please select a category');
      return false;
    }
    if (!formData.subcategoryName) {
      showNotification('error', 'Please select a subcategory');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showNotification('error', 'Please enter a valid price');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      showNotification('error', 'Please enter a valid stock quantity');
      return false;
    }
    // PHASE 1: Validate rating if provided
    if (formData.rating && (parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5)) {
      showNotification('error', 'Rating must be between 0.0 and 5.0');
      return false;
    }
    return true;
  };
  
  // PRODUCTION FIX: All old color variant functions removed
  // Color management is now handled via selectedColors and colorImages in formData

  // CRUD Operations
  const handleAddProduct = async () => {
    if (!validateForm()) return;

    // PRODUCTION FIX: Validate color selections if present
    if (formData.selectedColors.length > 0) {
      for (const color of formData.selectedColors) {
        const images = formData.colorImages[color.id] || [];
        if (images.length === 0) {
          showNotification('error', `Color "${color.displayName}" must have at least one image`);
          return;
        }
        const primaryCount = images.filter(img => img.isPrimary).length;
        if (primaryCount !== 1) {
          showNotification('error', `Color "${color.displayName}" must have exactly one primary image`);
          return;
        }
      }
    }

    // PRODUCTION FIX: Close modal immediately after validation succeeds
    setShowAddModal(false);
    resetForm();

    try {
      setIsLoading(true);
      
      // PRODUCTION FIX: Upload images to Cloudinary if colors selected
      let uploadedColorData: Array<{ colorId: number; uploadedImages: Array<{ url: string; publicId: string; altText: string; isPrimary: boolean; displayOrder: number }> }> = [];
      
      if (formData.selectedColors.length > 0) {
        showNotification('success', 'Uploading images ');
        
        try {
          const allPublicIds: string[] = [];
          
          for (const color of formData.selectedColors) {
            const images = formData.colorImages[color.id] || [];
            const uploadedImages: Array<{ url: string; publicId: string; altText: string; isPrimary: boolean; displayOrder: number }> = [];
            
            for (const image of images) {
              // Skip existing images that don't need re-upload
              if (!image.file) {
                console.log('Skipping existing image (no file):', image.fileName);
                continue;
              }
              
              const formData = new FormData();
              formData.append('file', image.file);
              formData.append('upload_preset', 'ps_bags_preset');
              
              const response = await fetch('https://api.cloudinary.com/v1_1/dzyhoeurm/image/upload', {
                method: 'POST',
                body: formData,
              });
              
              console.log("Cloudinary response status:", response.status, response.statusText);
              
              if (!response.ok) {
                const error = await response.json();
             
                throw new Error('Failed to upload image');
              }
              
              const result = await response.json();      
              uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id,
                altText: image.altText || '',
                isPrimary: image.isPrimary,
                displayOrder: image.displayOrder
              });
              
              allPublicIds.push(result.public_id);
            }
            
            uploadedColorData.push({
              colorId: color.id,
              uploadedImages
            });
          }
          
        } catch (uploadError: any) {
          showNotification('error', uploadError.message || 'Failed to upload images');
          return;
        }
      }
      
      // PRODUCTION FIX: Prepare FormData with color variants
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('quantity', formData.stock);
      formDataToSend.append('isActive', formData.isActive ? "1" : "0");
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      if (formData.subcategoryName) {
        formDataToSend.append('subcategoryName', formData.subcategoryName);
      }
      if (formData.originalPrice) {
        formDataToSend.append('originalPrice', formData.originalPrice);
      }
      if (formData.discount) {
        formDataToSend.append('discount', formData.discount);
      }
      if (formData.rating) {
        formDataToSend.append('rating', formData.rating);
      }
      
      formDataToSend.append('shippingType', formData.shippingType);
      formDataToSend.append('shippingCost', formData.shippingType === 'PAID' ? formData.shippingCost : '0');
      
      // Add sizes
      formDataToSend.append('XS', formData.xs);
      formDataToSend.append('M', formData.m);
      formDataToSend.append('L', formData.l);
      formDataToSend.append('XL', formData.xl);
      formDataToSend.append('XXL', formData.xxl);
      
      // PRODUCTION FIX: Add color variants as JSON if present
      if (uploadedColorData.length > 0) {
        const colorsPayload = formData.selectedColors.map((color, index) => {
          const uploadData = uploadedColorData.find(u => u.colorId === color.id);
          if (!uploadData) {
            throw new Error(`Upload data missing for color ${color.displayName}`);
          }
          
          return {
            colorMasterId: color.id,
            variantCode: null, // PRODUCTION FIX: No variant code in UI
            displayOrder: index,
            images: uploadData.uploadedImages.map((img) => ({
              imageUrl: img.url,
              imagePublicId: img.publicId,
              altText: img.altText,
              displayOrder: img.displayOrder,
              isPrimary: img.isPrimary
            }))
          };
        });
        
        formDataToSend.append('colors', JSON.stringify(colorsPayload));
      }

      
      const entries = Array.from(formDataToSend.entries());
      entries.forEach(([key, value]) => {
        if (key === 'colors') {
          console.log(key, ':', JSON.parse(value as string));
        } else {
          console.log(key, ':', value);
        }
      });
     

      const response = await adminProductService.addProduct(formDataToSend as any);

      try {
        const created = response.data || response.product || null;
        if (created) {
          const transformed = transformApiProduct(created);
          setProducts(prev => [transformed, ...prev]);
          setApiProducts(prev => [created as any, ...prev]);
        } else {
          loadProducts();
        }
      } catch {
        loadProducts();
      }

      showNotification('success', response.message || 'Product added successfully!');
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!validateForm() || !selectedProduct) return;

    // PRODUCTION FIX: Validate color selections if present
    if (formData.selectedColors.length > 0) {
      for (const color of formData.selectedColors) {
        const images = formData.colorImages[color.id] || [];
        if (images.length === 0) {
          showNotification('error', `Color "${color.displayName}" must have at least one image`);
          return;
        }
        const primaryCount = images.filter(img => img.isPrimary).length;
        if (primaryCount !== 1) {
          showNotification('error', `Color "${color.displayName}" must have exactly one primary image`);
          return;
        }
      }
    }

    // PRODUCTION FIX: Close modal immediately after validation succeeds
    setShowEditModal(false);
    setSelectedProduct(null);
    resetForm();

    try {
      setIsLoading(true);
      
      let uploadedColorData: Array<{ colorId: number; uploadedImages: Array<{ url: string; publicId: string; altText: string; isPrimary: boolean; displayOrder: number }> }> = [];
      
      if (formData.selectedColors.length > 0) {
        showNotification('success', 'Uploading images ');
        
        try {
          const allPublicIds: string[] = [];
          
          for (const color of formData.selectedColors) {
            const images = formData.colorImages[color.id] || [];
            const uploadedImages: Array<{ url: string; publicId: string; altText: string; isPrimary: boolean; displayOrder: number }> = [];
            
            for (const image of images) {
              // Skip existing images that don't need re-upload
              if (!image.file) {
                // For existing images, use existing URLs
                if (image.imageUrl && image.imagePublicId) {
                  uploadedImages.push({
                    url: image.imageUrl,
                    publicId: image.imagePublicId,
                    altText: image.altText || '',
                    isPrimary: image.isPrimary,
                    displayOrder: image.displayOrder
                  });
                }
                continue;
              }
              
              const formData = new FormData();
              formData.append('file', image.file);
              formData.append('upload_preset', 'ps_bags_preset');
              
              const response = await fetch('https://api.cloudinary.com/v1_1/dzyhoeurm/image/upload', {
                method: 'POST',
                body: formData,
              });
              
              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Failed to upload image');
              }
              
              const result = await response.json();
              
              uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id,
                altText: image.altText || '',
                isPrimary: image.isPrimary,
                displayOrder: image.displayOrder
              });
              
              allPublicIds.push(result.public_id);
            }
            
            uploadedColorData.push({
              colorId: color.id,
              uploadedImages
            });
          }
        } catch (uploadError: any) {
          showNotification('error', uploadError.message || 'Failed to upload images');
          return;
        }
      }
      
      // PRODUCTION FIX: Prepare FormData
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('quantity', formData.stock);
      formDataToSend.append('isActive', formData.isActive ? "1" : "0");
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      
      if (formData.subcategoryName) {
        formDataToSend.append('subcategoryName', formData.subcategoryName);
      }
      if (formData.originalPrice) {
        formDataToSend.append('originalPrice', formData.originalPrice);
      }
      if (formData.discount) {
        formDataToSend.append('discount', formData.discount);
      }
      if (formData.rating) {
        formDataToSend.append('rating', formData.rating);
      }
      
      formDataToSend.append('shippingType', formData.shippingType);
      formDataToSend.append('shippingCost', formData.shippingType === 'PAID' ? formData.shippingCost : '0');
      
      formDataToSend.append('XS', formData.xs);
      formDataToSend.append('M', formData.m);
      formDataToSend.append('L', formData.l);
      formDataToSend.append('XL', formData.xl);
      formDataToSend.append('XXL', formData.xxl);
      
      // PRODUCTION FIX: Add color variants as JSON if present (same format as Add Product)
      if (uploadedColorData.length > 0) {
        const colorsPayload = formData.selectedColors.map((color, index) => {
          const uploadData = uploadedColorData.find(u => u.colorId === color.id);
          if (!uploadData) {
            throw new Error(`Upload data missing for color ${color.displayName}`);
          }
          
          return {
            colorMasterId: color.id,
            variantCode: null, 
            displayOrder: index,
            images: uploadData.uploadedImages.map((img) => ({
              imageUrl: img.url,
              imagePublicId: img.publicId,
              altText: img.altText,
              displayOrder: img.displayOrder,
              isPrimary: img.isPrimary
            }))
          };
        });
        
        // Use 'colors' field name (backend now supports both 'colors' and 'colorUpdates')
        formDataToSend.append('colors', JSON.stringify(colorsPayload));
      }

      const response = await adminProductService.updateProduct(parseInt(selectedProduct.id), formDataToSend as any);

      try {
        const updated = response.data || response.product || null;
        if (updated) {
          const transformed = transformApiProduct(updated);
          setProducts(prev => prev.map(p => p.id === transformed.id ? transformed : p));
          setApiProducts(prev => prev.map((p: any) => p.id?.toString() === transformed.id ? updated as any : p));
        } else {
          loadProducts();
        }
      } catch {
        loadProducts();
      }

      showNotification('success', response.message || 'Product updated successfully!');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      showNotification('error', error.response?.data?.message || error.message || 'Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    const productToDelete = selectedProduct;
    const idNum = parseInt(productToDelete.id);
    const prevProducts = products;
    const prevApiProducts = apiProducts;

    setShowDeleteModal(false);
    setSelectedProduct(null);

    setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    setLatestProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    setApiProducts(prev => prev.filter((p: any) => p.id !== idNum));

    try {
      const response = await adminProductService.deleteProduct(idNum);
      showNotification('success', response.message || 'Product deleted successfully!');
      loadProducts();
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      setProducts(prevProducts);
      setApiProducts(prevApiProducts);
      showNotification('error', error?.response?.data || 'Failed to delete product. Please try again.');
    }
  };

  const openEditModal = async (product: Product) => {
    setSelectedProduct(product);
    setIsLoading(true);
    
    try {
      // Fetch full product details including color variants from backend
      const fullProduct = await adminProductService.getProductById(parseInt(product.id));
      
      const apiProduct: any = apiProducts.find(p => p.id.toString() === product.id) || fullProduct;
      const existingOriginal = ((product.originalPrice as any) ?? (apiProduct?.originalPrice as any) ?? '') as string;
      const priceStr = product.price.toString();
      const existingDiscount = ((product.discount as any) ?? (apiProduct?.discount as any) ?? '') as string;
      const derivedDiscount = existingDiscount || (existingOriginal ? calculateDiscount(existingOriginal, priceStr) : '');
      
      // Load existing colors and images from product
      const existingColors: ColorMaster[] = [];
      const existingColorImages: { [colorId: number]: ColorImage[] } = {};
      
      if (fullProduct.productColors && fullProduct.productColors.length > 0) {
        for (const productColor of fullProduct.productColors) {
          if (productColor.colorMaster) {
            existingColors.push(productColor.colorMaster);
            
            // Map existing images
            if (productColor.images && productColor.images.length > 0) {
              existingColorImages[productColor.colorMaster.id] = productColor.images.map(img => ({
                id: img.id,
                fileName: img.imagePublicId || 'existing-image',
                preview: img.imageUrl,
                file: null, // Existing image, no file
                fileSize: img.fileSize || 0,
                altText: img.altText || '',
                displayOrder: img.displayOrder,
                isPrimary: img.isPrimary,
                // Keep track of existing image data for updates
                imageUrl: img.imageUrl,
                imagePublicId: img.imagePublicId
              }));
            }
          }
        }
      }
      
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        subcategoryName: apiProduct?.subcategoryName || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        isActive: product.status === 'active',
        shippingType: (apiProduct?.shippingType as 'FREE' | 'PAID') || 'FREE',
        shippingCost: apiProduct?.shippingCost?.toString() || '0',
        originalPrice: product.originalPrice ?? '',
        discount: product.discount ?? '',
        rating: apiProduct?.rating?.toString() || '',
        xs: apiProduct?.XS || apiProduct?.xs || '0',
        m: apiProduct?.M || apiProduct?.m || '0',
        l: apiProduct?.L || apiProduct?.l || '0',
        xl: apiProduct?.XL || apiProduct?.xl || '0',
        xxl: apiProduct?.XXL || apiProduct?.xxl || '0',
        selectedColors: existingColors,
        colorImages: existingColorImages
      });
      
      if (product.category) {
        loadSubcategoriesForCategory(product.category);
      }
      
      setShowEditModal(true);
    } catch (error) {
      console.error('Failed to load product details:', error);
      showNotification('error', 'Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your product inventory and listings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Product</span>
            </button>
            <button
              onClick={() => setShowSubcategoryModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Add Subcategory</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingProducts ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory === 'all' 
                ? searchTerm 
                  ? `No products found matching "${searchTerm}"`
                  : "There are no products to display."
                : `No products found in "${selectedCategory}" category${searchTerm ? ` matching "${searchTerm}"` : ''}`
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.image && product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {/* Latest Badge for Latest category */}
                  {selectedCategory === 'Latest' && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        New
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-black">
                      {formatPrice(product.price)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className={getStockColor(product.stock)}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      ID: {product.id}
                    </p>
                    
                    {product.createdAt && (
                      <p className="text-xs text-gray-500">
                        Added: {formatDate(product.createdAt)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                      title="Edit Product"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                      title="Delete Product"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, category: e.target.value, subcategoryName: "" }));
                      loadSubcategoriesForCategory(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== 'all' && cat !== 'Latest').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                  {filteredSubcategories.length === 0 ? (
                    <p className="text-sm text-gray-500 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                      No subcategories available for this category. Please add subcategories first.
                    </p>
                  ) : (
                    <select
                      value={formData.subcategoryName}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategoryName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    >
                      <option value="">Select Subcategory</option>
                      {filteredSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.subcategoryName}>
                          {subcategory.subcategoryName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value, discount: calculateDiscount(prev.originalPrice, e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value, discount: calculateDiscount(e.target.value, prev.price) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              {/* PHASE 1: Rating Field */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (0.0 - 5.0)
                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.0"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if no rating</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Type</label>
                  <select
                    value={formData.shippingType}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingType: e.target.value as 'FREE' | 'PAID', shippingCost: e.target.value === 'FREE' ? '0' : prev.shippingCost }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="FREE">Free Shipping</option>
                    <option value="PAID">Paid Shipping</option>
                  </select>
                </div>
                {formData.shippingType === 'PAID' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost (₹)</label>
                    <input
                      type="number"
                      value={formData.shippingCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, shippingCost: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              {/* PRODUCTION FIX: New Color Selection UI */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Colors & Images</h4>
                <p className="text-sm text-gray-500 mb-4">Add colors and their images for this product</p>
                
                {/* Add New Color Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add New Color</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          console.log("BUTTON CLICKED (Enter key)");
                          handleCreateColor();
                        }
                      }}
                      placeholder="Enter color name (e.g. Red, Blue)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        console.log("BUTTON CLICKED");
                        handleCreateColor();
                      }}
                      className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Add Color
                    </button>
                  </div>
                </div>

                {/* Colors Multi-Select Dropdown */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                  <div 
                    className="min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:border-black bg-white cursor-pointer"
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                  >
                    {formData.selectedColors.length === 0 ? (
                      <span className="text-gray-500">Select colors...</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.selectedColors.map((color) => (
                          <span
                            key={color.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            <div
                              className="w-3 h-3 rounded-full border border-blue-300"
                              style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                            />
                            {color.displayName}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Remove color and its images
                                const images = formData.colorImages[color.id] || [];
                                images.forEach(img => URL.revokeObjectURL(img.preview));
                                const newColorImages = { ...formData.colorImages };
                                delete newColorImages[color.id];
                                setFormData(prev => ({
                                  ...prev,
                                  selectedColors: prev.selectedColors.filter(c => c.id !== color.id),
                                  colorImages: newColorImages
                                }));
                              }}
                              className="hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Searchable Dropdown */}
                  {showColorDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search colors..."
                          value={colorSearchTerm}
                          onChange={(e) => setColorSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {isLoadingColors ? (
                          <div className="px-4 py-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Loading colors...</p>
                          </div>
                        ) : colorSearchError ? (
                          <div className="px-4 py-3 text-sm text-red-600 text-center">{colorSearchError}</div>
                        ) : availableColors.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">No colors found</div>
                        ) : (
                          availableColors
                            .filter(color => !formData.selectedColors.some(sc => sc.id === color.id))
                            .map((color) => (
                              <button
                                key={color.id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedColors: [...prev.selectedColors, color],
                                    colorImages: { ...prev.colorImages, [color.id]: [] }
                                  }));
                                  setShowColorDropdown(false);
                                  setColorSearchTerm('');
                                  setNewColorInput('');
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center space-x-3"
                              >
                                <div
                                  className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">{color.displayName}</div>
                                  <div className="text-xs text-gray-500">{color.hexCode}</div>
                                </div>
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Image Sections per Color */}
                {formData.selectedColors.length > 0 && (
                  <div className="space-y-6">
                    {formData.selectedColors.map((color) => {
                      const images = formData.colorImages[color.id] || [];
                      return (
                        <div key={color.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded border border-gray-300"
                                style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                              />
                              <h5 className="text-sm font-semibold text-gray-900">Images for {color.displayName}</h5>
                            </div>
                            <label className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                              Upload Images
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;

                                  if (images.length + files.length > 10) {
                                    showNotification('error', `Maximum 10 images allowed per color`);
                                    return;
                                  }

                                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                                  if (files.some(f => !allowedTypes.includes(f.type))) {
                                    showNotification('error', 'Only JPG, JPEG, PNG, WEBP allowed');
                                    return;
                                  }

                                  const maxSize = 5 * 1024 * 1024;
                                  if (files.some(f => f.size > maxSize)) {
                                    showNotification('error', 'Some files exceed 5MB limit');
                                    return;
                                  }

                                  const newImages = files.map((file, index) => ({
                                    id: -(Date.now() + index),
                                    file,
                                    preview: URL.createObjectURL(file),
                                    altText: '',
                                    displayOrder: images.length + index + 1,
                                    isPrimary: images.length === 0 && index === 0,
                                    fileName: file.name,
                                    fileSize: file.size
                                  }));

                                  setFormData(prev => ({
                                    ...prev,
                                    colorImages: {
                                      ...prev.colorImages,
                                      [color.id]: [...images, ...newImages]
                                    }
                                  }));

                                  e.target.value = '';
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {images.length === 0 ? (
                            <div className="text-center py-6 bg-white rounded border border-dashed border-gray-300">
                              <p className="text-xs text-gray-500">No images uploaded yet</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {images
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((image) => (
                                  <div
                                    key={image.id}
                                    className={`relative group rounded-lg overflow-hidden border-2 ${
                                      image.isPrimary ? 'border-blue-500' : 'border-gray-200'
                                    }`}
                                  >
                                    <img
                                      src={image.preview}
                                      alt={image.altText || image.fileName}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedImages = images.map(img =>
                                            img.id === image.id
                                              ? img
                                              : { ...img, isPrimary: false }
                                          ).map(img =>
                                            img.id === image.id
                                              ? { ...img, isPrimary: true }
                                              : img
                                          );
                                          setFormData(prev => ({
                                            ...prev,
                                            colorImages: {
                                              ...prev.colorImages,
                                              [color.id]: updatedImages
                                            }
                                          }));
                                        }}
                                        className={`px-2 py-1 text-xs rounded ${
                                          image.isPrimary
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                      >
                                        {image.isPrimary ? 'Primary' : 'Set Primary'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          URL.revokeObjectURL(image.preview);
                                          const remainingImages = images.filter(img => img.id !== image.id);
                                          if (image.isPrimary && remainingImages.length > 0) {
                                            remainingImages[0].isPrimary = true;
                                          }
                                          setFormData(prev => ({
                                            ...prev,
                                            colorImages: {
                                              ...prev.colorImages,
                                              [color.id]: remainingImages
                                            }
                                          }));
                                        }}
                                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                    {image.isPrimary && (
                                      <div className="absolute top-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                                        Primary
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-500">
                            {images.length} / 10 images • {images.filter(img => img.isPrimary).length === 1 ? '✓' : '✗'} Primary image required
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isLoading ? 'Creating...' : 'Create Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Edit Product</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, category: e.target.value, subcategoryName: "" }));
                      loadSubcategoriesForCategory(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat !== 'all' && cat !== 'Latest').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                  {filteredSubcategories.length === 0 ? (
                    <p className="text-sm text-gray-500 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                      No subcategories available for this category. Please add subcategories first.
                    </p>
                  ) : (
                    <select
                      value={formData.subcategoryName}
                      onChange={(e) => setFormData(prev => ({ ...prev, subcategoryName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    >
                      <option value="">Select Subcategory</option>
                      {filteredSubcategories.map(subcategory => (
                        <option key={subcategory.id} value={subcategory.subcategoryName}>
                          {subcategory.subcategoryName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value, discount: calculateDiscount(prev.originalPrice, e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value, discount: calculateDiscount(e.target.value, prev.price) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              {/* PRODUCTION FIX: Rating, Stock, Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (0.0 - 5.0)
                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0.0"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if no rating</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Type</label>
                  <select
                    value={formData.shippingType}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingType: e.target.value as 'FREE' | 'PAID', shippingCost: e.target.value === 'FREE' ? '0' : prev.shippingCost }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="FREE">Free Shipping</option>
                    <option value="PAID">Paid Shipping</option>
                  </select>
                </div>
                {formData.shippingType === 'PAID' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost (₹)</label>
                    <input
                      type="number"
                      value={formData.shippingCost}
                      onChange={(e) => setFormData(prev => ({ ...prev, shippingCost: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              {/* PRODUCTION FIX: New Color Selection UI */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Colors & Images</h4>
                <p className="text-sm text-gray-500 mb-4">Add colors and their images for this product</p>
                
                {/* Add New Color Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add New Color</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          console.log("BUTTON CLICKED (Enter key)");
                          handleCreateColor();
                        }
                      }}
                      placeholder="Enter color name (e.g. Red, Blue)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        console.log("BUTTON CLICKED");
                        handleCreateColor();
                      }}
                      className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Add Color
                    </button>
                  </div>
                </div>

                {/* Colors Multi-Select Dropdown */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
                  <div 
                    className="min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:border-black bg-white cursor-pointer"
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                  >
                    {formData.selectedColors.length === 0 ? (
                      <span className="text-gray-500">Select colors...</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.selectedColors.map((color) => (
                          <span
                            key={color.id}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            <div
                              className="w-3 h-3 rounded-full border border-blue-300"
                              style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                            />
                            {color.displayName}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Remove color and its images
                                const images = formData.colorImages[color.id] || [];
                                images.forEach(img => URL.revokeObjectURL(img.preview));
                                const newColorImages = { ...formData.colorImages };
                                delete newColorImages[color.id];
                                setFormData(prev => ({
                                  ...prev,
                                  selectedColors: prev.selectedColors.filter(c => c.id !== color.id),
                                  colorImages: newColorImages
                                }));
                              }}
                              className="hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Searchable Dropdown */}
                  {showColorDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                      <div className="p-2 border-b border-gray-200">
                        <input
                          type="text"
                          placeholder="Search colors..."
                          value={colorSearchTerm}
                          onChange={(e) => setColorSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {isLoadingColors ? (
                          <div className="px-4 py-6 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                            <p className="text-sm text-gray-500">Loading colors...</p>
                          </div>
                        ) : colorSearchError ? (
                          <div className="px-4 py-3 text-sm text-red-600 text-center">{colorSearchError}</div>
                        ) : availableColors.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">No colors found</div>
                        ) : (
                          availableColors
                            .filter(color => !formData.selectedColors.some(sc => sc.id === color.id))
                            .map((color) => (
                              <button
                                key={color.id}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedColors: [...prev.selectedColors, color],
                                    colorImages: { ...prev.colorImages, [color.id]: [] }
                                  }));
                                  setShowColorDropdown(false);
                                  setColorSearchTerm('');
                                  setNewColorInput('');
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center space-x-3"
                              >
                                <div
                                  className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">{color.displayName}</div>
                                  <div className="text-xs text-gray-500">{color.hexCode}</div>
                                </div>
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Image Sections per Color */}
                {formData.selectedColors.length > 0 && (
                  <div className="space-y-6">
                    {formData.selectedColors.map((color) => {
                      const images = formData.colorImages[color.id] || [];
                      return (
                        <div key={color.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded border border-gray-300"
                                style={{ backgroundColor: color.hexCode || '#CCCCCC' }}
                              />
                              <h5 className="text-sm font-semibold text-gray-900">Images for {color.displayName}</h5>
                            </div>
                            <label className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                              Upload Images
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;

                                  if (images.length + files.length > 10) {
                                    showNotification('error', `Maximum 10 images allowed per color`);
                                    return;
                                  }

                                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                                  if (files.some(f => !allowedTypes.includes(f.type))) {
                                    showNotification('error', 'Only JPG, JPEG, PNG, WEBP allowed');
                                    return;
                                  }

                                  const maxSize = 5 * 1024 * 1024;
                                  if (files.some(f => f.size > maxSize)) {
                                    showNotification('error', 'Some files exceed 5MB limit');
                                    return;
                                  }

                                  const newImages = files.map((file, index) => ({
                                    id: -(Date.now() + index),
                                    file,
                                    preview: URL.createObjectURL(file),
                                    altText: '',
                                    displayOrder: images.length + index + 1,
                                    isPrimary: images.length === 0 && index === 0,
                                    fileName: file.name,
                                    fileSize: file.size
                                  }));

                                  setFormData(prev => ({
                                    ...prev,
                                    colorImages: {
                                      ...prev.colorImages,
                                      [color.id]: [...images, ...newImages]
                                    }
                                  }));

                                  e.target.value = '';
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {images.length === 0 ? (
                            <div className="text-center py-6 bg-white rounded border border-dashed border-gray-300">
                              <p className="text-xs text-gray-500">No images uploaded yet</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {images
                                .sort((a, b) => a.displayOrder - b.displayOrder)
                                .map((image) => (
                                  <div
                                    key={image.id}
                                    className={`relative group rounded-lg overflow-hidden border-2 ${
                                      image.isPrimary ? 'border-blue-500' : 'border-gray-200'
                                    }`}
                                  >
                                    <img
                                      src={image.preview}
                                      alt={image.altText || image.fileName}
                                      className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedImages = images.map(img =>
                                            img.id === image.id
                                              ? img
                                              : { ...img, isPrimary: false }
                                          ).map(img =>
                                            img.id === image.id
                                              ? { ...img, isPrimary: true }
                                              : img
                                          );
                                          setFormData(prev => ({
                                            ...prev,
                                            colorImages: {
                                              ...prev.colorImages,
                                              [color.id]: updatedImages
                                            }
                                          }));
                                        }}
                                        className={`px-2 py-1 text-xs rounded ${
                                          image.isPrimary
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                      >
                                        {image.isPrimary ? 'Primary' : 'Set Primary'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          URL.revokeObjectURL(image.preview);
                                          const remainingImages = images.filter(img => img.id !== image.id);
                                          if (image.isPrimary && remainingImages.length > 0) {
                                            remainingImages[0].isPrimary = true;
                                          }
                                          setFormData(prev => ({
                                            ...prev,
                                            colorImages: {
                                              ...prev.colorImages,
                                              [color.id]: remainingImages
                                            }
                                          }));
                                        }}
                                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                    {image.isPrimary && (
                                      <div className="absolute top-1 left-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                                        Primary
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-500">
                            {images.length} / 10 images • {images.filter(img => img.isPrimary).length === 1 ? '✓' : '✗'} Primary image required
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  resetForm();
                }}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditProduct}
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isLoading ? 'Updating...' : 'Update Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && selectedProduct && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{selectedProduct.name}</strong>? This will permanently remove the product from your inventory.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isLoading ? 'Deleting...' : 'Delete Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      <AddSubcategoryModal
        isOpen={showSubcategoryModal}
        onClose={() => setShowSubcategoryModal(false)}
        onSuccess={() => {
          loadSubcategories();
          showNotification('success', 'Subcategory added successfully!');
        }}
      />

      {/* Subcategory Management Modal */}
      {showSubcategoryManagement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Manage Subcategories</h3>
                <button
                  onClick={() => setShowSubcategoryManagement(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <SubcategoryManagement />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductsPage;
