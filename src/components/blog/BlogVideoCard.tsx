'use client';

import { useState } from 'react';
import LazyImage from './LazyImage';
import { Blog } from '@/services/blogService';
import BlogVideoModal from './BlogVideoModal';

interface BlogVideoCardProps {
  blog: Blog;
}

const BlogVideoCard = ({ blog }: BlogVideoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <>
      <article 
        className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Video Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden">
          <LazyImage
            src={blog.thumbnailUrl || '/psbags/bag1.jpeg'}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Outer Ring */}
              <div className="absolute inset-0 w-16 h-16 border-2 border-white/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              
              {/* Play Button */}
              <div className="relative w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 transition-all duration-300 group-hover:bg-white/50 group-hover:w-16 group-hover:h-16">
                <svg 
                  className="w-5 h-5 text-white ml-0.5 transition-all duration-300 group-hover:w-6 group-hover:h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
              Video
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-black transition-colors duration-200">
            {blog.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {truncateText(blog.description, 100)}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-medium">
                {formatDate(blog.date)}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="text-xs font-semibold text-black hover:text-gray-700 transition-colors duration-200 flex items-center space-x-1"
            >
              <span>Watch</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>
      </article>

      {/* Video Modal */}
      <BlogVideoModal
        blog={blog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BlogVideoCard;