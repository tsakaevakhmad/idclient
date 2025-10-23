import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../constants';
import { User } from '../types';
import { PhoneConfirmationResponse } from '../api/types';

/**
 * User Service
 * Handles user profile and verification operations
 */
class UserService {
  /**
   * Get current user information
   */
  async getUserInfo() {
    return apiClient.get<User>(API_ENDPOINTS.USER.GET_INFO);
  }

  /**
   * Send phone confirmation code to user
   */
  async sendPhoneConfirmationCode() {
    return apiClient.get<PhoneConfirmationResponse>(API_ENDPOINTS.USER.SEND_PHONE_CODE);
  }

  /**
   * Verify phone confirmation code
   */
  async verifyPhoneConfirmationCode(confirmationCode: string) {
    return apiClient.get<PhoneConfirmationResponse>(
      `${API_ENDPOINTS.USER.VERIFY_PHONE_CODE}?confirmationCode=${confirmationCode}`
    );
  }
}

export const userService = new UserService();
