import apiClient from '../api/client';
import { AuthorizationSession, UserSessionDto, RevokeAllSessionsResponse } from '../api/types';

/**
 * Service for managing user authorization sessions and user login sessions
 */
class SessionService {
  private readonly AUTHORIZATION_URL = '/api/v1/user/authorizations';
  private readonly USER_SESSION_URL = '/api/UserManager/UserSessions';

  // ========== Authorization Sessions (OAuth) ==========

  /**
   * Get current user's authorization sessions (OAuth authorizations)
   */
  async getMySessions(status?: string): Promise<AuthorizationSession[]> {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<AuthorizationSession[]>(`${this.AUTHORIZATION_URL}/my`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user authorization sessions:', error);
      throw error;
    }
  }

  /**
   * Revoke a specific authorization session (OAuth authorization)
   */
  async revokeSession(authorizationId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<boolean>(
        `${this.AUTHORIZATION_URL}/revoke/${authorizationId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error revoking authorization session:', error);
      throw error;
    }
  }

  // ========== User Sessions (Login Sessions) ==========

  /**
   * Get current user's login sessions (devices/browsers with active sessions)
   */
  async getMyUserSessions(): Promise<UserSessionDto[]> {
    try {
      const response = await apiClient.get<UserSessionDto[]>(`${this.USER_SESSION_URL}/My`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user login sessions:', error);
      throw error;
    }
  }

  /**
   * Revoke a specific user login session (logout from a specific device)
   */
  async revokeUserSession(sessionId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.USER_SESSION_URL}/Revoke/${sessionId}`);
    } catch (error) {
      console.error('Error revoking user session:', error);
      throw error;
    }
  }

  /**
   * Revoke all user login sessions except the current one (logout from all other devices)
   */
  async revokeAllUserSessionsExceptCurrent(): Promise<RevokeAllSessionsResponse> {
    try {
      const response = await apiClient.delete<RevokeAllSessionsResponse>(
        `${this.USER_SESSION_URL}/RevokeAllExceptCurrent`
      );
      return response.data;
    } catch (error) {
      console.error('Error revoking all user sessions:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;
