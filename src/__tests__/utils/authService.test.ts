import { authService } from '@services/authService';
import { apiClient } from '@api/client';

// Mock the API client
jest.mock('@api/client');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginTwoFa', () => {
    it('should call API with correct payload', async () => {
      const mockResponse = { data: { id: '123', status: 'Success' } };
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.loginTwoFa('test@example.com');

      expect(apiClient.post).toHaveBeenCalledWith('/api/Authorization/LoginTwoFa', {
        identifier: 'test@example.com',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('verifyLoginTwoFa', () => {
    it('should verify 2FA code correctly', async () => {
      const mockResponse = { data: { status: 'Success' } };
      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.verifyLoginTwoFa('123', '456789');

      expect(apiClient.post).toHaveBeenCalledWith('/api/Authorization/VerifyLoginTwoFa', {
        id: '123',
        code: '456789',
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('isAuthorized', () => {
    it('should check authorization status', async () => {
      const mockResponse = { data: { status: 'Success' } };
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.isAuthorized();

      expect(apiClient.get).toHaveBeenCalledWith('/api/Authorization/IsAuthorized');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      const mockResponse = { data: {} };
      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      await authService.logout();

      expect(apiClient.get).toHaveBeenCalledWith('/api/Authorization/LogOut');
    });
  });
});
