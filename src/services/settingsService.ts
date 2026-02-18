import apiClient from '../api/client';
import { PublicSettings } from '../types/settings';

class SettingsService {
  async getPublicSettings(): Promise<PublicSettings> {
    const response = await apiClient.get<PublicSettings>('/api/settings/public');
    return response.data;
  }
}

export default new SettingsService();
