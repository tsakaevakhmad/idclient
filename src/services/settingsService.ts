import apiClient from '../api/client';
import { PublicSettings } from '../types/settings';

const API_BASE = process.env.REACT_APP_BASE_URI || 'https://localhost:7253';

class SettingsService {
  async getPublicSettings(): Promise<PublicSettings> {
    const response = await apiClient.get<PublicSettings>(`${API_BASE}/api/settings/public`);
    return response.data;
  }
}

export default new SettingsService();
