import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../constants';

class AccountSettingsService {
  async changePhone(newPhone: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.USER.CHANGE_PHONE, { newPhone });
  }

  async confirmPhoneChange(newPhone: string, code: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.USER.CONFIRM_PHONE_CHANGE, { newPhone, code });
  }

  async changeEmail(newEmail: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.USER.CHANGE_EMAIL, { newEmail });
  }

  async confirmEmailChange(userId: string, newEmail: string, token: string): Promise<boolean> {
    const params = new URLSearchParams({ userId, newEmail, token });
    const response = await apiClient.get<{ success: boolean }>(
      `${API_ENDPOINTS.USER.CONFIRM_EMAIL_CHANGE}?${params.toString()}`
    );
    return response.data.success;
  }
}

export const accountSettingsService = new AccountSettingsService();
