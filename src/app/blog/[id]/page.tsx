'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { blogService, Blog } from '@/services/blogService';
import BlogVideoModal from '@/components/blog/BlogVideoModal';

const BlogPostPage = () => {
  const params = useParams();
  const slug = params.id as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const blogData = await blogService.getBlogBySlug(slug);
        
        if (blogData && blogData.isActive === "1") {
          setBlog(blogData);
        } else {
          setError('Blog post not found or not available');
        }
      } catch (error) {
        console.error('Failed to load blog:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-8">{error || "The blog post you're looking for doesn't exist."}</p>
          <Link
            href="/blog"
            className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors duration-200 rounded-full"
          >
            Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="text-gray-500 hover:text-black transition-colors duration-200">
              Video Blog
            </Link>
            <span className="mx-2 text-gray-400">→</span>
            <span className="text-black">{blog.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-black text-white px-3 py-1 text-sm font-medium rounded">
                Video Blog
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <span>{formatDate(blog.date)}</span>
              <span>•</span>
              <span>Video Content</span>
            </div>

            {/* Video Thumbnail with Play Button */}
            <div 
              className="relative aspect-video mb-8 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={blog.thumbnailUrl || '/psbags/bag1.jpeg'}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 w-20 h-20 border-2 border-white/50 rounded-full animate-pulse"></div>
                  
                  {/* Play Button */}
                  <div className="relative w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 transition-all duration-300 group-hover:bg-white/50 group-hover:w-20 group-hover:h-20">
                    <svg 
                      className="w-6 h-6 text-white ml-1 transition-all duration-300 group-hover:w-8 group-hover:h-8" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Watch Video Button */}
              <div className="absolute bottom-4 left-4">
                <button className="bg-white text-black px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-white/90">
                  Watch Video
                </button>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed text-lg">
              {blog.description}
            </div>
          </article>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link
                href="/blog"
                className="text-black hover:text-gray-700 transition-colors duration-200 font-medium"
              >
                ← Back to Video Blog
              </Link>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                Watch Full Video
              </button>
            </div>
          </footer>
        </main>

        <Footer />
      </div>

      {/* Video Modal */}
      <BlogVideoModal
        blog={blog}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BlogPostPage;