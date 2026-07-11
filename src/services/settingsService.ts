import { apiService } from '@/utils/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8086';

export interface AppSettings {
  id: number;
  gstPercentage: number;
  businessName: string | null;
  businessEmail: string | null;
  businessMobile: string | null;
  businessWhatsapp: string | null;
}

export interface BusinessInfoRequest {
  businessName: string;
  businessEmail: string;
  businessMobile: string;
  businessWhatsapp: string;
}

export const settingsService = {
  getSettings: async (): Promise<AppSettings> => {
    return apiService.admin.getSettings();
  },

  updateGst: async (gstPercentage: number): Promise<AppSettings> => {
    return apiService.admin.updateGst(gstPercentage);
  },

  updateBusinessInfo: async (data: BusinessInfoRequest): Promise<AppSettings> => {
    return apiService.admin.updateBusinessInfo(data);
  },

  // Public — no auth required, used by the enquiry form
  getPublicWhatsapp: async (): Promise<string> => {
    const response = await fetch(`${API_URL}/public/settings/whatsapp`);
    if (!response.ok) return '';
    const data = await response.json();
    return data.businessWhatsapp ?? '';
  },
};
