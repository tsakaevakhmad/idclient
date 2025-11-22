import apiClient from '../api/client';
import { AuthorizationSession } from '../api/types';

/**
 * Service for managing user authorization sessions
 */
class SessionService {
  private readonly BASE_URL = '/api/v1/user/authorizations';

  /**
   * Get current user's authorization sessions
   */
  async getMySessions(status?: string): Promise<AuthorizationSession[]> {
    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<AuthorizationSession[]>(`${this.BASE_URL}/my`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
  }

  /**
   * Revoke a specific authorization session
   */
  async revokeSession(authorizationId: string): Promise<boolean> {
    try {
      const response = await apiClient.delete<boolean>(
        `${this.BASE_URL}/revoke/${authorizationId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error revoking session:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;
