'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Blog, blogService } from '@/services/blogService';
import BlogVideoCard from './BlogVideoCard';

interface BlogVideoModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
}

const BlogVideoModal = ({ blog, isOpen, onClose }: BlogVideoModalProps) => {
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && blog.id) {
      // Load related blogs
      blogService.getRelatedBlogs(blog.id, 3)
        .then(setRelatedBlogs)
        .catch(console.error);
    }
  }, [isOpen, blog.id]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  const modalContent = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className={`relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          
          {/* Video Section */}
          <div className="relative aspect-video bg-black">
            {blog.videoUrl ? (
              <video
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={blog.thumbnailUrl}
              >
                <source src={blog.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <p className="text-lg">Video not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span>{formatDate(blog.date)}</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Video Blog</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                {blog.description}
              </p>
            </div>

            {/* Related Videos */}
            {relatedBlogs.length > 0 && (
              <div className="border-t border-gray-200 pt-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Related Videos
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <div key={relatedBlog.id} className="transform scale-90">
                      <BlogVideoCard blog={relatedBlog} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in a portal
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default BlogVideoModal;