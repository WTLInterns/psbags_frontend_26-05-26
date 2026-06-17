'use client';

import React, { useState, useRef } from 'react';
import { BlogFormData } from '@/services/adminBlogService';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: BlogFormData) => Promise<void>;
  blog?: any; // Existing blog data for edit mode
  isEdit?: boolean;
  isLoading?: boolean;
}

const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  blog,
  isEdit = false,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: blog?.title || '',
    description: blog?.description || '',
    isActive: blog?.isActive === '1' || true,
    thumbnail: null,
    video: null,
    thumbnailPreview: blog?.thumbnailUrl || '',
    videoPreview: blog?.videoUrl || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, thumbnail: 'Please select an image file' }));
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, thumbnail: 'Thumbnail must be less than 10MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          thumbnail: file,
          thumbnailPreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setErrors(prev => ({ ...prev, video: 'Please select a video file' }));
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, video: 'Video must be less than 100MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          video: file,
          videoPreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({ ...prev, video: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!isEdit && !formData.thumbnail) {
      newErrors.thumbnail = 'Thumbnail is required for new blog';
    }

    if (!isEdit && !formData.video) {
      newErrors.video = 'Video is required for new blog';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Convert boolean to string for backend compatibility
      const submitData = {
        ...formData,
        isActive: formData.isActive ? '1' : '0'
      };
      
      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      isActive: true,
      thumbnail: null,
      video: null,
      thumbnailPreview: '',
      videoPreview: ''
    });
    setErrors({});
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleClose = () => {
    if (!isEdit) resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Blog' : 'Add New Blog'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {isEdit ? 'Update blog information' : 'Create a new video blog post'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter blog title"
                disabled={isLoading}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Active Status Toggle */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Active Status</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive as boolean}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Enter blog description"
              disabled={isLoading}
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail {!isEdit && '*'}
              </label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.thumbnail ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
              
              {/* Thumbnail Preview */}
              {formData.thumbnailPreview && (
                <div className="mt-2">
                  <img
                    src={formData.thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video {!isEdit && '*'}
              </label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.video ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video}</p>}
              
              {/* Video Preview */}
              {formData.videoPreview && (
                <div className="mt-2">
                  <video
                    src={formData.videoPreview}
                    controls
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isLoading ? 'Saving...' : (isEdit ? 'Update Blog' : 'Create Blog')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;