// PRODUCTION FIX: Shared color types for admin product form

export interface ColorMaster {
  id: number;
  name: string;
  displayName: string;
  hexCode: string | null; // Can be null if not set
  sortOrder?: number;
  isActive?: boolean;
}

export interface ColorImage {
  id?: number; // Optional - existing images have DB id, new images don't
  file: File | null; // Null for existing images
  preview: string; // Object URL for preview or existing image URL
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
  fileName: string;
  fileSize: number;
  // For existing images
  imageUrl?: string;
  imagePublicId?: string;
}

export interface SelectedColorWithImages {
  colorId: number;
  colorName: string;
  colorDisplayName: string;
  hexCode: string | null;
  images: ColorImage[];
}


export interface SelectedColorWithImages {
  colorId: number;
  colorName: string;
  colorDisplayName: string;
  hexCode: string | null;
  images: ColorImage[];
}
