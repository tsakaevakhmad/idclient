import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../constants';
import {
  LoginTwoFaRequest,
  LoginTwoFaResponse,
  VerifyLoginTwoFaRequest,
  VerifyLoginTwoFaResponse,
  RegisterRequest,
  RegisterResponse,
  IsAuthorizedResponse,
  QRSignInResponse,
} from '../api/types';
import { ExternalProvider } from '../types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Initiate 2FA login process
   */
  async loginTwoFa(identifier: string) {
    const payload: LoginTwoFaRequest = { identifier };
    return apiClient.post<LoginTwoFaResponse>(API_ENDPOINTS.AUTH.LOGIN_TWO_FA, payload);
  }

  /**
   * Verify 2FA login code
   */
  async verifyLoginTwoFa(id: string, code: string) {
    const payload: VerifyLoginTwoFaRequest = { id, code };
    return apiClient.post<VerifyLoginTwoFaResponse>(
      API_ENDPOINTS.AUTH.VERIFY_LOGIN_TWO_FA,
      payload
    );
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest) {
    return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  /**
   * Check if user is authorized
   */
  async isAuthorized() {
    return apiClient.get<IsAuthorizedResponse>(API_ENDPOINTS.AUTH.IS_AUTHORIZED);
  }

  /**
   * Log out current user
   */
  async logout() {
    return apiClient.get(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * Get external authentication providers
   */
  async getExternalProviders(params?: string) {
    const config = params ? { params: { queryParams: params } } : {};
    return apiClient.get<ExternalProvider[]>(API_ENDPOINTS.AUTH.GET_PROVIDERS, config);
  }

  /**
   * Sign in with QR code token
   */
  async qrSignIn(token: string) {
    return apiClient.post<QRSignInResponse>(
      API_ENDPOINTS.AUTH.QR_SIGN_IN,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export const authService = new AuthService();
