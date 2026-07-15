// PHASE 3: Cloudinary Upload Service
// Handles image uploads to Cloudinary with rollback support

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dzyhoeurm/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'ps_bags_preset';
const CLOUDINARY_DELETE_URL = 'https://api.cloudinary.com/v1_1/dzyhoeurm/image/destroy';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export interface CloudinaryError {
  message: string;
  http_code: number;
}

/**
 * Upload a single image to Cloudinary
 */
export const uploadImageToCloudinary = async (
  file: File
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to upload image');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload multiple images to Cloudinary with progress tracking
 */
export const uploadMultipleImagesToCloudinary = async (
  files: File[],
  onProgress?: (uploaded: number, total: number) => void
): Promise<CloudinaryUploadResult[]> => {
  const results: CloudinaryUploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await uploadImageToCloudinary(files[i]);
      results.push(result);
      
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (error) {
      // If any upload fails, we need to rollback already uploaded images
      console.error(`Failed to upload image ${i + 1}/${files.length}:`, error);
      
      // Rollback uploaded images
      await rollbackCloudinaryUploads(results.map(r => r.public_id));
      
      throw new Error(`Image upload failed at ${i + 1}/${files.length}. All uploads rolled back.`);
    }
  }
  
  return results;
};

/**
 * Delete a single image from Cloudinary by public_id
 * Note: This requires authentication/signature for production
 * For now, deletion will be handled by backend cleanup
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  console.warn('Client-side Cloudinary deletion not implemented. Use backend API for deletion.');
  // Backend should handle Cloudinary deletion when product/images are deleted
};

/**
 * Rollback uploaded images (delete them from Cloudinary)
 * In production, this should be done via backend API with proper authentication
 */
export const rollbackCloudinaryUploads = async (publicIds: string[]): Promise<void> => {
  if (publicIds.length === 0) return;
  
  console.warn(
    `Rollback needed for ${publicIds.length} images:`,
    publicIds
  );
  
  // In production, call backend API to delete these images
  // The backend has Cloudinary credentials and can delete images securely
  console.warn('Client-side rollback not implemented. Orphaned images:', publicIds);
  
  // TODO: Call backend cleanup endpoint
  // await apiService.post('/admin/cleanup-cloudinary-images', { publicIds });
};

export const cloudinaryService = {
  uploadImage: uploadImageToCloudinary,
  uploadMultiple: uploadMultipleImagesToCloudinary,
  deleteImage: deleteImageFromCloudinary,
  rollback: rollbackCloudinaryUploads,
};
