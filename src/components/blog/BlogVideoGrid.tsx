'use client';

import { Blog } from '@/services/blogService';
import BlogVideoCard from './BlogVideoCard';

interface BlogVideoGridProps {
  blogs: Blog[];
  isLoading?: boolean;
}

const BlogVideoGrid = ({ blogs, isLoading = false }: BlogVideoGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-xl mb-4"></div>
            <div className="space-y-3">
              <div className="bg-gray-200 h-6 rounded w-3/4"></div>
              <div className="bg-gray-200 h-4 rounded w-full"></div>
              <div className="bg-gray-200 h-4 rounded w-5/6"></div>
              <div className="flex justify-between items-center">
                <div className="bg-gray-200 h-4 rounded w-24"></div>
                <div className="bg-gray-200 h-4 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m8-4v3M9 7v10l7-5-7-5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Available</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're working on creating amazing video content for you. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
          Video Collection
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of premium video content
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {blogs.map((blog) => (
          <BlogVideoCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Load More Placeholder */}
      {blogs.length > 0 && blogs.length % 6 === 0 && (
        <div className="text-center pt-8">
          <button className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            Load More Videos
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogVideoGrid;