'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { announcementService, AnnouncementData, AnnouncementRequest } from '@/services/announcementService';

const AnnouncementBarPage = () => {
  const [announcement, setAnnouncement] = useState<AnnouncementData>({});
  const [formData, setFormData] = useState<AnnouncementRequest>({
    text1: '',
    text2: '',
    text3: '',
    text4: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    loadCurrentAnnouncement();
  }, []);

  const loadCurrentAnnouncement = async () => {
    try {
      setIsLoading(true);
      const data = await announcementService.getCurrentAnnouncement();
      setAnnouncement(data);
      setFormData({
        text1: data.text1 || '',
        text2: data.text2 || '',
        text3: data.text3 || '',
        text4: data.text4 || '',
        isActive: data.isActive ?? true
      });
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to load announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      const updatedAnnouncement = await announcementService.updateAnnouncement(formData);
      setAnnouncement(updatedAnnouncement);
      showNotification('success', 'Announcement updated successfully!');
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update announcement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof AnnouncementRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getPreviewAnnouncements = () => {
    const announcements = [];
    if (formData.text1?.trim()) announcements.push(formData.text1);
    if (formData.text2?.trim()) announcements.push(formData.text2);
    if (formData.text3?.trim()) announcements.push(formData.text3);
    if (formData.text4?.trim()) announcements.push(formData.text4);
    return announcements;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading announcement data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Announcement Bar</h1>
              <p className="text-gray-600 mt-1">Manage the rotating announcement messages displayed at the top of your website</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {formData.isActive && getPreviewAnnouncements().length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
            <div className="bg-black text-white text-center py-2 px-4 rounded-lg">
              <div className="text-sm">
                {getPreviewAnnouncements()[0]} {/* Show first announcement as preview */}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {getPreviewAnnouncements().length > 1 && 
                `This will rotate between ${getPreviewAnnouncements().length} announcements every 3.5 seconds`
              }
            </p>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Announcement Bar Status</h3>
                <p className="text-sm text-gray-500">Enable or disable the announcement bar</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Announcement Text Fields */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Announcement Messages</h3>
              <p className="text-sm text-gray-500">Enter up to 4 announcement messages. They will rotate automatically on the website.</p>
              
              {[1, 2, 3, 4].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Announcement {num} {num === 1 && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={formData[`text${num}` as keyof AnnouncementRequest] as string || ''}
                    onChange={(e) => handleInputChange(`text${num}` as keyof AnnouncementRequest, e.target.value)}
                    placeholder={`Enter announcement message ${num}...`}
                    rows={2}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {num === 1 ? 'Required' : 'Optional'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(formData[`text${num}` as keyof AnnouncementRequest] as string || '').length}/500
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={loadCurrentAnnouncement}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSaving || !formData.text1?.trim()}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">How it works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Announcements rotate automatically every 3.5 seconds</li>
            <li>• Only non-empty announcement messages will be displayed</li>
            <li>• At least one announcement message is required</li>
            <li>• Changes take effect immediately on the website</li>
            <li>• You can disable the entire announcement bar using the toggle above</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnnouncementBarPage;