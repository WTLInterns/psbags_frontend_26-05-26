// PHASE 2: Color Variants Section Component with Image Management
// Local state only - no image upload, no API integration, no backend

'use client';

import React from 'react';

export interface ColorMaster {
  id: number;
  name: string;
  displayName: string;
  hexCode: string;
}

// PHASE 2: Image data structure
export interface ColorImage {
  id: string; // Temporary ID for local state
  file: File;
  preview: string; // Object URL for preview
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
  fileName: string;
  fileSize: number;
}

export interface ColorVariant {
  tempId: string;
  colorId: number | null;
  colorName: string;
  colorDisplayName: string;
  hexCode: string;
  variantCode: string;
  images: ColorImage[]; // PHASE 2: Add images array
}

interface ColorVariantsSectionProps {
  colorVariants: ColorVariant[];
  availableColors: ColorMaster[];
  colorSearchTerm: string;
  showColorDropdown: string | null;
  isLoadingColors: boolean;
  colorSearchError: string | null;
  onAddVariant: () => void;
  onRemoveVariant: (tempId: string) => void;
  onSelectColor: (tempId: string, color: ColorMaster) => void;
  onUpdateVariantCode: (tempId: string, variantCode: string) => void;
  onSetColorSearchTerm: (term: string) => void;
  onSetShowColorDropdown: (tempId: string | null) => void;
  onShowNotification: (type: 'success' | 'error', message: string) => void;
  // PHASE 2: Image management
  onAddImages: (variantTempId: string, files: File[]) => void;
  onRemoveImage: (variantTempId: string, imageId: string) => void;
  onUpdateImageAltText: (variantTempId: string, imageId: string, altText: string) => void;
  onUpdateImageDisplayOrder: (variantTempId: string, imageId: string, order: number) => void;
  onSetPrimaryImage: (variantTempId: string, imageId: string) => void;
}

const ColorVariantsSection: React.FC<ColorVariantsSectionProps> = ({
  colorVariants,
  availableColors,
  colorSearchTerm,
  showColorDropdown,
  isLoadingColors,
  colorSearchError,
  onAddVariant,
  onRemoveVariant,
  onSelectColor,
  onUpdateVariantCode,
  onSetColorSearchTerm,
  onSetShowColorDropdown,
  onShowNotification,
  onAddImages,
  onRemoveImage,
  onUpdateImageAltText,
  onUpdateImageDisplayOrder,
  onSetPrimaryImage,
}) => {
  // PHASE 2: File input handling
  const handleFileSelect = (variantTempId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    const variant = colorVariants.find(v => v.tempId === variantTempId);
    if (!variant) return;

    // Validation: Maximum 10 images
    if (variant.images.length + files.length > 10) {
      onShowNotification('error', `Maximum 10 images allowed. Current: ${variant.images.length}`);
      return;
    }

    // Validation: File types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(f => !allowedTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
      onShowNotification('error', `Invalid file types. Only JPG, JPEG, PNG, WEBP allowed.`);
      return;
    }

    // Validation: File size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(f => f.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      onShowNotification('error', `Some files exceed 5MB limit.`);
      return;
    }

    onAddImages(variantTempId, files);
    
    // Reset input
    event.target.value = '';
  };

  // PHASE 2: Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // PHASE 2: Validate images for a variant
  const getImageValidationErrors = (variant: ColorVariant): string[] => {
    const errors: string[] = [];
    
    if (variant.images.length === 0) {
      errors.push('At least one image is required');
    }
    
    if (variant.images.length > 10) {
      errors.push('Maximum 10 images allowed');
    }
    
    const primaryCount = variant.images.filter(img => img.isPrimary).length;
    if (primaryCount === 0 && variant.images.length > 0) {
      errors.push('Exactly one primary image is required');
    } else if (primaryCount > 1) {
      errors.push('Only one primary image allowed');
    }
    
    return errors;
  };

  // PRODUCTION: Colors are pre-filtered by backend search
  // Just display what we receive from parent component
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Color Variants</h4>
          <p className="text-sm text-gray-500">Add different colors for this product</p>
        </div>
        <button
          type="button"
          onClick={onAddVariant}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Color</span>
        </button>
      </div>

      {/* Color Variants List */}
      {colorVariants.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <p className="text-gray-600 font-medium">No color variants added yet</p>
          <p className="text-sm text-gray-500 mt-1">Click "Add Color" to start</p>
        </div>
      ) : (
        <div className="space-y-4">
          {colorVariants.map((variant, index) => (
            <div key={variant.tempId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full border-2 border-gray-300 font-semibold text-gray-700">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {variant.colorDisplayName || 'Select Color'}
                    </h5>
                    {variant.hexCode && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: variant.hexCode }}
                        />
                        <span className="text-xs text-gray-500">{variant.hexCode}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveVariant(variant.tempId)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  title="Remove Color"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Color Selector */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        onSetShowColorDropdown(showColorDropdown === variant.tempId ? null : variant.tempId);
                        onSetColorSearchTerm('');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-left flex items-center justify-between bg-white"
                    >
                      <span className={variant.colorDisplayName ? 'text-gray-900' : 'text-gray-500'}>
                        {variant.colorDisplayName || 'Select a color'}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Searchable Dropdown */}
                    {showColorDropdown === variant.tempId && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                        <div className="p-2 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search colors..."
                            value={colorSearchTerm}
                            onChange={(e) => onSetColorSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:border-black"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {isLoadingColors ? (
                            <div className="px-4 py-6 text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                              <p className="text-sm text-gray-500">Loading colors...</p>
                            </div>
                          ) : colorSearchError ? (
                            <div className="px-4 py-3 text-sm text-red-600 text-center">
                              <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {colorSearchError}
                            </div>
                          ) : availableColors.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No colors found
                            </div>
                          ) : (
                            availableColors.map((color) => {
                              const isSelected = colorVariants.some(
                                v => v.tempId !== variant.tempId && v.colorId === color.id
                              );
                              return (
                                <button
                                  key={color.id}
                                  type="button"
                                  onClick={() => onSelectColor(variant.tempId, color)}
                                  disabled={isSelected}
                                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-150 flex items-center space-x-3 ${
                                    isSelected ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
                                  } ${variant.colorId === color.id ? 'bg-blue-50' : ''}`}
                                >
                                  <div
                                    className="w-6 h-6 rounded border border-gray-300 flex-shrink-0"
                                    style={{ backgroundColor: color.hexCode }}
                                  />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{color.displayName}</div>
                                    <div className="text-xs text-gray-500">{color.hexCode}</div>
                                  </div>
                                  {isSelected && (
                                    <span className="text-xs text-gray-500">Already added</span>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Variant Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Code
                    <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={variant.variantCode}
                    onChange={(e) => onUpdateVariantCode(variant.tempId, e.target.value)}
                    placeholder="e.g., BAG-BLACK-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              {/* PHASE 2: Image Management Section */}
              <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h6 className="text-sm font-semibold text-gray-900">Images</h6>
                  <label className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer flex items-center space-x-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Upload Images</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={(e) => handleFileSelect(variant.tempId, e)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Validation Errors */}
                {getImageValidationErrors(variant).length > 0 && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 space-y-1">
                    {getImageValidationErrors(variant).map((error, idx) => (
                      <div key={idx} className="flex items-start space-x-1">
                        <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Image Previews */}
                {variant.images.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded border border-dashed border-gray-300">
                    <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500">No images uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {variant.images
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((image) => (
                        <div
                          key={image.id}
                          className={`flex items-start space-x-3 p-2 rounded border ${
                            image.isPrimary ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {/* Thumbnail */}
                          <img
                            src={image.preview}
                            alt={image.altText || image.fileName}
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                          />

                          {/* Image Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {image.fileName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(image.fileSize)}
                                </p>
                              </div>
                              
                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => onRemoveImage(variant.tempId, image.id)}
                                className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete Image"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            {/* Alt Text Input */}
                            <input
                              type="text"
                              value={image.altText}
                              onChange={(e) => onUpdateImageAltText(variant.tempId, image.id, e.target.value)}
                              placeholder="Alt text (optional)"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black mb-1"
                            />

                            {/* Display Order and Primary Toggle */}
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <label className="text-xs text-gray-600">Order:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={image.displayOrder}
                                  onChange={(e) => {
                                    const order = parseInt(e.target.value) || 1;
                                    onUpdateImageDisplayOrder(variant.tempId, image.id, order);
                                  }}
                                  className="w-14 px-2 py-0.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-black focus:border-black"
                                />
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => onSetPrimaryImage(variant.tempId, image.id)}
                                className={`flex items-center space-x-1 px-2 py-0.5 text-xs rounded transition-colors ${
                                  image.isPrimary
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{image.isPrimary ? 'Primary' : 'Set Primary'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Image Guidelines */}
                <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                  <p>• Accepted formats: JPG, JPEG, PNG, WEBP</p>
                  <p>• Maximum 10 images per color</p>
                  <p>• Maximum file size: 5MB per image</p>
                  <p>• Exactly one primary image required</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorVariantsSection;
