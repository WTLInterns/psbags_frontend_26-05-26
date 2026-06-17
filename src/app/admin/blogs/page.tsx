'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogModal from '@/components/admin/BlogModal';
import { adminBlogService, Blog, BlogFormData } from '@/services/adminBlogService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';

const BlogsPage = () => {
  const { isAuthenticated, admin, isLoading: isAuthLoading } = useAdminAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Blogs data from API
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Load blogs from API
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

    loadBlogs();
  }, [isAuthenticated, isAuthLoading, router]);

  const loadBlogs = async () => {
    try {
      const fetchedBlogs = await adminBlogService.getAllBlogs();
      setBlogs(fetchedBlogs);
    } catch (error: any) {
      console.error('Error loading blogs:', error);
      if (error.response?.status === 500) {
        showNotification('error', 'Admin server error. Please try again later.');
      } else if (error.response?.status === 404) {
        showNotification('error', 'Blogs not found');
      } else if (error.response?.status === 403) {
        showNotification('error', 'You do not have permission to view blogs');
      } else if (error.response?.status === 401) {
        showNotification('error', 'Your session may have expired. Please refresh or login again.');
      } else {
        showNotification('error', error.message || 'Failed to load blogs. Please try again.');
      }
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  const getFilteredBlogs = () => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  };
  
  const filteredBlogs = getFilteredBlogs();

  const getStatusColor = (status: string) => {
    return status === '1'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  // Helper functions
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // CRUD Operations
  const handleAddBlog = async (blogData: BlogFormData) => {
    try {
      setIsLoading(true);
      const response = await adminBlogService.addBlog(blogData);

      // Reload blogs to get updated list
      await loadBlogs();
      
      setShowAddModal(false);
      showNotification('success', response.message || 'Blog added successfully!');
    } catch (error: any) {
      console.error('Failed to add blog:', error);
      showNotification('error', error.response?.data?.message || 'Failed to add blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlog = async (blogData: BlogFormData) => {
    if (!selectedBlog) return;

    try {
      setIsLoading(true);
      const response = await adminBlogService.updateBlog(selectedBlog.id, blogData);

      // Reload blogs to get updated list
      await loadBlogs();

      setShowEditModal(false);
      setSelectedBlog(null);
      showNotification('success', response.message || 'Blog updated successfully!');
    } catch (error: any) {
      console.error('Failed to update blog:', error);
      showNotification('error', error.response?.data?.message || 'Failed to update blog. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!selectedBlog) return;

    // Store selectedBlog reference before clearing state
    const blogToDelete = selectedBlog;

    // Close modal immediately for better UX
    setShowDeleteModal(false);
    setSelectedBlog(null);

    // Optimistic UI: remove immediately for snappy UX
    setBlogs(prev => prev.filter(b => b.id !== blogToDelete.id));

    try {
      const response = await adminBlogService.deleteBlog(blogToDelete.id);
      showNotification('success', response.message || 'Blog deleted successfully!');
      // Reload blogs in background
      loadBlogs();
    } catch (error: any) {
      console.error('Failed to delete blog:', error);
      // Revert on failure
      loadBlogs();
      showNotification('error', error?.response?.data?.message || 'Failed to delete blog. Please try again.');
    }
  };

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowEditModal(true);
  };

  const openDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const toggleBlogStatus = async (blog: Blog) => {
    const newStatus = blog.isActive === '1' ? '0' : '1';
    const updatedBlog: BlogFormData = {
      title: blog.title,
      description: blog.description,
      isActive: newStatus,
    };

    try {
      await adminBlogService.updateBlog(blog.id, updatedBlog);
      // Update local state immediately
      setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, isActive: newStatus } : b));
      showNotification('success', `Blog ${newStatus === '1' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error: any) {
      console.error('Failed to update blog status:', error);
      showNotification('error', 'Failed to update blog status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    // Handle the "dd/MM/yyyy" format from backend
    const [day, month, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your blog posts and video content
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
              <span>Add Blog</span>
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
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingBlogs ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Blogs Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No blogs found matching "${searchTerm}"`
                : "There are no blogs to display."
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Add Your First Blog
            </button>
          </div>
        ) : (
          /* Blogs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBlogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Blog Thumbnail */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {blog.thumbnailUrl ? (
                    <img
                      src={blog.thumbnailUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      blog.isActive === '1'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {blog.isActive === '1' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Blog Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                      {blog.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        ID: {blog.id}
                      </span>
                    </div>
                    
                    {blog.date && (
                      <p className="text-xs text-gray-500">
                        Created: {formatDate(blog.date)}
                      </p>
                    )}

                    {blog.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {blog.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-col space-y-2">
                    {/* Quick Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleBlogStatus(blog)}
                        className="flex-1 px-3 py-2 text-xs font-medium border rounded-md transition-colors duration-200"
                        style={{
                          color: blog.isActive === '1' ? '#dc2626' : '#16a34a',
                          borderColor: blog.isActive === '1' ? '#dc2626' : '#16a34a',
                        }}
                        title={blog.isActive === '1' ? 'Deactivate' : 'Activate'}
                      >
                        {blog.isActive === '1' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    
                    {/* Main Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        title="Edit Blog"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(blog)}
                        className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                        title="Delete Blog"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="text-sm text-gray-500">
          Showing {filteredBlogs.length} of {blogs.length} blogs
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <BlogModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddBlog}
          isLoading={isLoading}
        />
      )}

      {showEditModal && selectedBlog && (
        <BlogModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBlog(null);
          }}
          onSave={handleEditBlog}
          blog={selectedBlog}
          isEdit={true}
          isLoading={isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">Delete Blog</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Are you sure you want to delete "{selectedBlog.title}"? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedBlog(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBlog}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Blog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
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
    </AdminLayout>
  );
};

export default BlogsPage;