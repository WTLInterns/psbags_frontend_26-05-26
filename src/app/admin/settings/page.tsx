'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { settingsService, AppSettings, BusinessInfoRequest } from '@/services/settingsService';

const SettingsPage = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // GST state
  const [gstInput, setGstInput] = useState('');
  const [isSavingGst, setIsSavingGst] = useState(false);

  // Business info state
  const [bizForm, setBizForm] = useState<BusinessInfoRequest>({
    businessName: '',
    businessEmail: '',
    businessMobile: '',
    businessWhatsapp: '',
  });
  const [isSavingBiz, setIsSavingBiz] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
        setGstInput(data.gstPercentage?.toString() ?? '18');
        setBizForm({
          businessName: data.businessName ?? '',
          businessEmail: data.businessEmail ?? '',
          businessMobile: data.businessMobile ?? '',
          businessWhatsapp: data.businessWhatsapp ?? '',
        });
      } catch {
        showNotification('error', 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveGst = async () => {
    const val = parseFloat(gstInput);
    if (isNaN(val) || val < 0 || val > 100) {
      showNotification('error', 'GST must be between 0 and 100');
      return;
    }
    try {
      setIsSavingGst(true);
      const updated = await settingsService.updateGst(val);
      setSettings(updated);
      setGstInput(updated.gstPercentage.toString());
      showNotification('success', `GST updated to ${updated.gstPercentage}%`);
    } catch {
      showNotification('error', 'Failed to update GST');
    } finally {
      setIsSavingGst(false);
    }
  };

  const handleBizChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBizForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBiz = async () => {
    if (!bizForm.businessWhatsapp.trim()) {
      showNotification('error', 'Business WhatsApp number is required');
      return;
    }
    try {
      setIsSavingBiz(true);
      const updated = await settingsService.updateBusinessInfo(bizForm);
      setSettings(updated);
      setBizForm({
        businessName: updated.businessName ?? '',
        businessEmail: updated.businessEmail ?? '',
        businessMobile: updated.businessMobile ?? '',
        businessWhatsapp: updated.businessWhatsapp ?? '',
      });
      showNotification('success', 'Business information saved');
    } catch {
      showNotification('error', 'Failed to save business information');
    } finally {
      setIsSavingBiz(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your store configuration</p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-gray-500 py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
            <span className="text-sm">Loading settings...</span>
          </div>
        ) : (
          <>
            {/* Business Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
                <p className="mt-1 text-sm text-gray-500">
                  These details are used across the platform. The WhatsApp number is used by the enquiry form to open a pre-filled chat.
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                  <div>
                    <label className={labelClass}>Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={bizForm.businessName}
                      onChange={handleBizChange}
                      className={inputClass}
                      placeholder="e.g. Regaloo by PS"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Business Email</label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={bizForm.businessEmail}
                      onChange={handleBizChange}
                      className={inputClass}
                      placeholder="e.g. regaloobyps@gmail.com"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Business Mobile</label>
                    <input
                      type="tel"
                      name="businessMobile"
                      value={bizForm.businessMobile}
                      onChange={handleBizChange}
                      className={inputClass}
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Business WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="businessWhatsapp"
                      value={bizForm.businessWhatsapp}
                      onChange={handleBizChange}
                      className={inputClass}
                      placeholder="e.g. 8983434817 (without country code)"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={handleSaveBiz}
                    disabled={isSavingBiz}
                    className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSavingBiz && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {isSavingBiz ? 'Saving...' : 'Save Business Info'}
                  </button>
                </div>
              </div>
            </div>

            {/* GST Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tax Configuration</h2>
                <p className="mt-1 text-sm text-gray-500">
                  This GST % is applied globally to all orders at checkout. Changing it takes effect immediately.
                </p>
              </div>
              <div className="p-6">
                <div className="max-w-sm space-y-4">
                  <div>
                    <label className={labelClass}>GST Percentage (%)</label>
                    {settings?.gstPercentage != null && (
                      <p className="text-xs text-gray-500 mb-2">
                        Current value: <span className="font-semibold text-gray-800">{settings.gstPercentage}%</span>
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={gstInput}
                        onChange={e => setGstInput(e.target.value)}
                        min="0"
                        max="100"
                        step="0.5"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-sm"
                        placeholder="e.g. 18"
                      />
                      <span className="text-gray-500 text-sm">%</span>
                      <button
                        onClick={handleSaveGst}
                        disabled={isSavingGst}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSavingGst && (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        {isSavingGst ? 'Saving...' : 'Save GST'}
                      </button>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                    <strong>How it works:</strong> The GST % is stored in the database and fetched live by the cart and checkout.
                    All new orders will use the updated rate. Existing orders retain their original snapshot.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
    </AdminLayout>
  );
};

export default SettingsPage;
