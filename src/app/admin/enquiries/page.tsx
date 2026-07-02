'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { enquiryService, EnquiryRecord, EnquiryPage } from '@/services/enquiryService';

const STATUSES = ['NEW', 'CONTACTED', 'FOLLOW UP', 'QUOTATION SENT', 'CLOSED'] as const;
type EnquiryStatus = typeof STATUSES[number];

const STATUS_STYLES: Record<string, string> = {
  'NEW':            'bg-blue-100 text-blue-800',
  'CONTACTED':      'bg-yellow-100 text-yellow-800',
  'FOLLOW UP':      'bg-orange-100 text-orange-800',
  'QUOTATION SENT': 'bg-purple-100 text-purple-800',
  'CLOSED':         'bg-green-100 text-green-800',
};

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function toInternationalMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function buildFollowUpMessage(enq: EnquiryRecord): string {
  const lines = [
    `Hello ${enq.fullName},`,
    '',
    'Thank you for contacting Regaloo BY PS.',
    '',
    `We received your enquiry regarding *${enq.productType}* (Qty: ${enq.productCount}).`,
    '',
    'Our team would like to discuss your requirement in detail.',
    'Please let us know a convenient time to connect.',
    '',
    'Regards,',
    'PS Bags Team',
  ];
  return encodeURIComponent(lines.join('\n'));
}

export default function EnquiriesPage() {
  const [data, setData]             = useState<EnquiryPage | null>(null);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(0);
  const [isLoading, setIsLoading]   = useState(true);

  // View modal state
  const [selected, setSelected]         = useState<EnquiryRecord | null>(null);
  const [modalStatus, setModalStatus]   = useState<string>('NEW');
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const load = useCallback(async (q: string, p: number) => {
    setIsLoading(true);
    try {
      const result = await enquiryService.getAllEnquiries(q, p, 20);
      setData(result);
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(search, page);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    load(search, 0);
  };

  const openModal = (enq: EnquiryRecord) => {
    setSelected(enq);
    setModalStatus(enq.status);
  };

  const closeModal = () => {
    setSelected(null);
    setModalStatus('NEW');
  };

  const handleSaveStatus = async () => {
    if (!selected) return;
    setIsSavingStatus(true);
    try {
      const updated = await enquiryService.updateStatus(selected.id, modalStatus);
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map(e => e.id === updated.id ? { ...e, status: updated.status } : e),
        };
      });
      showNotification('success', `Status updated to "${updated.status}"`);
      closeModal();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update status');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const totalPages = data?.totalPages ?? 0;
  const enquiries  = data?.content ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
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
            {notification.message}
          </div>
        )}

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
              <p className="text-gray-500 mt-1 text-sm">
                {data ? `${data.totalElements} total enquiries` : 'Loading...'}
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, mobile, company..."
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-64"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setPage(0); load('', 0); }}
                  className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-medium">No enquiries found</p>
              {search && <p className="text-sm mt-1">Try a different search term</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID', 'Name', 'Mobile', 'Company', 'Location', 'Product Type', 'Quantity', 'Status', 'Created Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {enquiries.map(enq => (
                    <tr key={enq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">#{enq.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{enq.fullName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{enq.mobile}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[140px] truncate" title={enq.companyName}>{enq.companyName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-[120px] truncate" title={enq.location}>{enq.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{enq.productType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{enq.productCount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_STYLES[enq.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(enq.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <button
                            onClick={() => openModal(enq)}
                            title="View details"
                            className="p-1.5 rounded-md text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${toInternationalMobile(enq.mobile)}?text=${buildFollowUpMessage(enq)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open customer WhatsApp chat"
                            className="p-1.5 rounded-md text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </a>

                          {/* Call */}
                          <a
                            href={`tel:${enq.mobile}`}
                            title="Call customer"
                            className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {(data?.number ?? 0) + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Enquiry #{selected.id}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3">
              {[
                { label: 'Full Name',           value: selected.fullName },
                { label: 'Mobile',              value: selected.mobile },
                { label: 'Company',             value: selected.companyName },
                { label: 'Location',            value: selected.location },
                { label: 'Product Requirement', value: selected.productRequirement },
                { label: 'Product Type',        value: selected.productType },
                { label: 'Product Count',       value: selected.productCount },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4">
                  <span className="text-sm font-medium text-gray-500 w-44 flex-shrink-0">{label}</span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              ))}

              <div className="flex gap-4 items-center pt-1">
                <span className="text-sm font-medium text-gray-500 w-44 flex-shrink-0">Current Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[selected.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {selected.status}
                </span>
              </div>

              {/* Status Update */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <label className="block text-sm font-medium text-gray-700">Update Status</label>
                <select
                  value={modalStatus}
                  onChange={e => setModalStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={handleSaveStatus}
                  disabled={isSavingStatus || modalStatus === selected.status}
                  className="w-full py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSavingStatus && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSavingStatus ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </div>

            {/* Modal Footer — WhatsApp + Call */}
            <div className="px-6 pb-6 flex gap-3">
              <a
                href={`https://wa.me/${toInternationalMobile(selected.mobile)}?text=${buildFollowUpMessage(selected)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={`tel:${selected.mobile}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
