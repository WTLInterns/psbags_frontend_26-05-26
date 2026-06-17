'use client';

import { useState } from 'react';
import LazyImage from './LazyImage';
import { Blog } from '@/services/blogService';
import BlogVideoModal from './BlogVideoModal';

interface FeaturedBlogHeroProps {
  blog: Blog;
}

const FeaturedBlogHero = ({ blog }: FeaturedBlogHeroProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!blog) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden rounded-2xl mb-8 sm:mb-12 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}>
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <LazyImage
            src={blog.thumbnailUrl || '/psbags/bag1.jpeg'}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        </div>

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>

        {/* Premium Badge */}
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Featured</span>
          </div>
        </div>

        {/* Play Button - Large Animated */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative">
            {/* Pulsing Ring */}
            <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 border-2 border-white/30 rounded-full animate-ping"></div>
            <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 border border-white/50 rounded-full animate-pulse"></div>
            
            {/* Play Button */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
              <svg 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white ml-1 transition-transform duration-300 group-hover:scale-110" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-10">
          <div className="max-w-4xl">
            
            {/* Date */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-white/80 text-sm font-medium">
                {formatDate(blog.date)}
              </span>
              <div className="w-1 h-1 bg-white/60 rounded-full"></div>
              <span className="text-white/80 text-sm font-medium">
                Latest Video
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Description */}
            <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mb-6 line-clamp-3">
              {blog.description}
            </p>

            {/* Watch Now Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="inline-flex items-center space-x-3 bg-white text-black px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-white/90 hover:scale-105 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Watch Now</span>
            </button>
          </div>
        </div>

        {/* Subtle Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </section>

      {/* Video Modal */}
      <BlogVideoModal
        blog={blog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FeaturedBlogHero;