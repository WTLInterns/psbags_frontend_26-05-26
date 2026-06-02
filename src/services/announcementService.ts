const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086';

export interface AnnouncementData {
  id?: number;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  announcements?: string[];
}

export interface AnnouncementRequest {
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  isActive?: boolean;
}

class AnnouncementService {
  // Public API - get active announcements for header
  async getActiveAnnouncements(): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/public/announcements`);
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }
      const data: AnnouncementData = await response.json();
      return data.announcements || [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Return default announcements on error
      return [
        "10% off when you subscribe to our emails. Brand exclusions apply. T&Cs apply",
        "Guess what's just landed? Discover the latest arrivals now",
        "All over india delivery and free returns - shop now"
      ];
    }
  }

  // Admin API - get current announcement for editing
  async getCurrentAnnouncement(): Promise<AnnouncementData> {
    const token = localStorage.getItem('garja_admin_token');
    console.log('ANNOUNCEMENT TOKEN EXISTS:', !!token);
    console.log('ANNOUNCEMENT TOKEN VALUE:', token?.substring(0, 20));
    
    if (!token) {
      throw new Error('Admin authentication required');
    }

    const response = await fetch(`${API_URL}/admin/announcement`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current announcement');
    }

    return response.json();
  }

  // Admin API - update announcement
  async updateAnnouncement(data: AnnouncementRequest): Promise<AnnouncementData> {
    const token = localStorage.getItem('garja_admin_token');
    const response = await fetch(`${API_URL}/admin/announcement`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update announcement');
    }

    return response.json();
  }
}

export const announcementService = new AnnouncementService();