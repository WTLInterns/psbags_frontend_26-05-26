const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8086';

export interface EnquiryFormData {
  fullName: string;
  mobile: string;
  companyName: string;
  productRequirement: string;
  location: string;
  productType: string;
  productCount: string;
}

export interface EnquiryRecord {
  id: number;
  fullName: string;
  mobile: string;
  companyName: string;
  productRequirement: string;
  location: string;
  productType: string;
  productCount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  success?: boolean;
  message?: string;
}

export interface EnquiryPage {
  content: EnquiryRecord[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

class EnquiryService {
  async submitEnquiry(data: EnquiryFormData): Promise<EnquiryRecord> {
    const response = await fetch(`${API_URL}/public/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const msg =
        errorBody?.message ||
        (errorBody?.errors && Object.values(errorBody.errors).join(', ')) ||
        'Failed to submit enquiry. Please try again.';
      throw new Error(msg);
    }

    return response.json();
  }

  async getAllEnquiries(search = '', page = 0, size = 20): Promise<EnquiryPage> {
    const token = localStorage.getItem('garja_admin_token');
    if (!token) throw new Error('Admin authentication required');

    const params = new URLSearchParams({
      search,
      page: String(page),
      size: String(size),
    });

    const response = await fetch(`${API_URL}/admin/enquiries?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch enquiries');
    return response.json();
  }

  async getEnquiryById(id: number): Promise<EnquiryRecord> {
    const token = localStorage.getItem('garja_admin_token');
    if (!token) throw new Error('Admin authentication required');

    const response = await fetch(`${API_URL}/admin/enquiries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch enquiry');
    return response.json();
  }

  async updateStatus(id: number, status: string): Promise<EnquiryRecord> {
    const token = localStorage.getItem('garja_admin_token');
    if (!token) throw new Error('Admin authentication required');

    const response = await fetch(
      `${API_URL}/admin/enquiries/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
  }
}

export const enquiryService = new EnquiryService();
