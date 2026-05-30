'use client';

import React, { useState, useEffect } from 'react';
import { subcategoryService, Subcategory, SubcategoryRequest } from '@/services/subcategoryService';
import AddSubcategoryModal from './AddSubcategoryModal';

export default function SubcategoryManagement() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [editFormData, setEditFormData] = useState<SubcategoryRequest>({
    categoryName: '',
    subcategoryName: ''
  });

  const CATEGORIES = [
    'Shop Online',
    'Corporate Gifts',
    'Wholesale / Distributor'
  ];

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const data = await subcategoryService.getAllSubcategories();
      setSubcategories(data);
    } catch (err) {
      setError('Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      await subcategoryService.deleteSubcategory(id);
      await fetchSubcategories();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to delete subcategory');
    }
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setEditFormData({
      categoryName: subcategory.categoryName,
      subcategoryName: subcategory.subcategoryName
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcategory) return;

    try {
      await subcategoryService.updateSubcategory(editingSubcategory.id, editFormData);
      setEditingSubcategory(null);
      await fetchSubcategories();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to update subcategory');
    }
  };

  const cancelEdit = () => {
    setEditingSubcategory(null);
    setEditFormData({ categoryName: '', subcategoryName: '' });
  };

  const groupedSubcategories = subcategories.reduce((acc, subcategory) => {
    if (!acc[subcategory.categoryName]) {
      acc[subcategory.categoryName] = [];
    }
    acc[subcategory.categoryName].push(subcategory);
    return acc;
  }, {} as Record<string, Subcategory[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Subcategory Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Subcategory
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {subcategories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No subcategories found. Add your first subcategory to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSubcategories).map(([categoryName, categorySubcategories]) => (
            <div key={categoryName} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">{categoryName}</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {categorySubcategories.map((subcategory) => (
                  <div key={subcategory.id} className="p-4">
                    {editingSubcategory?.id === subcategory.id ? (
                      <form onSubmit={handleUpdateSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <select
                            value={editFormData.categoryName}
                            onChange={(e) => setEditFormData({ ...editFormData, categoryName: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            {CATEGORIES.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editFormData.subcategoryName}
                            onChange={(e) => setEditFormData({ ...editFormData, subcategoryName: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Subcategory name"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">{subcategory.subcategoryName}</h4>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(subcategory.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(subcategory)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit subcategory"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(subcategory.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete subcategory"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSubcategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchSubcategories}
      />
    </div>
  );
}