import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './types';

/**
 * Creates and configures the Axios instance with interceptors
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: window.location.origin,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // You can add auth tokens or modify config here
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Centralized error handling
   */
  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      code: error.code,
    };

    if (error.response) {
      // Server responded with error status
      apiError.message =
        (error.response.data as { message?: string })?.message ||
        error.message ||
        'Server error occurred';
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'No response from server. Please check your connection.';
    } else {
      // Something else happened
      apiError.message = error.message || 'Request failed';
    }

    console.error('API Error:', apiError);
    return apiError;
  }

  /**
   * GET request
   */
  public async get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  /**
   * POST request
   */
  public async post<T>(url: string, data?: unknown, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  /**
   * PUT request
   */
  public async put<T>(url: string, data?: unknown, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  /**
   * DELETE request
   */
  public async delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }

  /**
   * PATCH request
   */
  public async patch<T>(url: string, data?: unknown, config = {}) {
    return this.client.patch<T>(url, data, config);
  }

  /**
   * Get the underlying Axios instance
   */
  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
