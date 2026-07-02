'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';
import Image from 'next/image';

interface CategoryPageProps {
  categoryName: string;
  categoryTitle: string;
  categoryBanner: string;
  categoryDescription: string;
}

const CategoryLandingPage: React.FC<CategoryPageProps> = ({
  categoryName,
  categoryTitle,
  categoryBanner,
  categoryDescription
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products for this category
        const allProducts = await productService.getProductsByCategory(categoryName);
        setProducts(allProducts);
      } catch (err) {
        console.error(`Error fetching ${categoryTitle} products:`, err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName, categoryTitle]);

  // Group products by subcategory
  const groupedProducts = products.reduce((acc, product) => {
    const subcat = product.subcategoryName || 'General';
    if (!acc[subcat]) {
      acc[subcat] = [];
    }
    acc[subcat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const subcategories = Object.keys(groupedProducts).sort();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Category Hero Banner */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
        <Image
          src={categoryBanner}
          alt={categoryTitle}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
              {categoryTitle}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
              {categoryDescription}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f5f56] mb-4"></div>
            <p className="text-gray-600">Loading your collection...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">We're currently updating this collection. Please check back soon!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {subcategories.map((subcat) => (
              <section key={subcat}>
                <div className="mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight uppercase">
                    {subcat}
                  </h2>
                  <div className="w-20 h-1 bg-[#1f5f56] mt-2"></div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                  {groupedProducts[subcat].map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryLandingPage;
