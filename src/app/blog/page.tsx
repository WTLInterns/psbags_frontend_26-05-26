'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedBlogHero from '@/components/blog/FeaturedBlogHero';
import BlogVideoGrid from '@/components/blog/BlogVideoGrid';
import BlogErrorBoundary, { BlogErrorFallback } from '@/components/blog/BlogErrorBoundary';
import { HeroSkeleton, GridSkeleton } from '@/components/blog/BlogLoadingSkeletons';
import { blogService, Blog } from '@/services/blogService';

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlog, setFeaturedBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load all blogs and latest blog in parallel
        const [allBlogs, latestBlog] = await Promise.all([
          blogService.getAllBlogs(),
          blogService.getLatestBlog()
        ]);
        
        // Filter out active blogs only
        const activeBlogs = allBlogs.filter(blog => blog.isActive === "1");
        
        setBlogs(activeBlogs);
        setFeaturedBlog(latestBlog && latestBlog.isActive === "1" ? latestBlog : null);
        
      } catch (error) {
        console.error('Failed to load blogs:', error);
        setError('Failed to load video blogs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Get blogs for grid (exclude featured blog from grid)
  const gridBlogs = blogs.filter(blog => blog.id !== featuredBlog?.id);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
            PS Bags Video Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection through exclusive video content showcasing the finest in bag craftsmanship and design.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <BlogErrorBoundary fallback={<BlogErrorFallback />}>
            <div className="space-y-8">
              {/* Featured Hero Skeleton */}
              <HeroSkeleton />
              
              {/* Grid Skeleton */}
              <GridSkeleton count={6} />
            </div>
          </BlogErrorBoundary>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Videos</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <BlogErrorBoundary fallback={<BlogErrorFallback />}>
            {/* Featured Blog Hero */}
            {featuredBlog && (
              <FeaturedBlogHero blog={featuredBlog} />
            )}

            {/* Video Grid */}
            <BlogVideoGrid blogs={gridBlogs} isLoading={isLoading} />
          </BlogErrorBoundary>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;