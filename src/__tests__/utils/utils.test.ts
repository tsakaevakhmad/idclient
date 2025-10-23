import { base64UrlDecode, base64UrlToUint8Array, formatErrorMessage } from '@utils/index';

describe('Utility Functions', () => {
  describe('base64UrlDecode', () => {
    it('should decode base64url string correctly', () => {
      const encoded = 'SGVsbG8gV29ybGQ';
      const result = base64UrlDecode(encoded);
      expect(result).toBe('Hello World');
    });

    it('should handle URL-safe characters', () => {
      const encoded = 'SGVsbG8tV29ybGQ_';
      const result = base64UrlDecode(encoded);
      expect(typeof result).toBe('string');
    });
  });

  describe('base64UrlToUint8Array', () => {
    it('should convert base64url to Uint8Array', () => {
      const encoded = 'SGVsbG8';
      const result = base64UrlToUint8Array(encoded);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatErrorMessage', () => {
    it('should format Error object', () => {
      const error = new Error('Test error');
      const result = formatErrorMessage(error);
      expect(result).toBe('Test error');
    });

    it('should format string error', () => {
      const error = 'String error';
      const result = formatErrorMessage(error);
      expect(result).toBe('String error');
    });

    it('should handle unknown error types', () => {
      const error = { unknown: 'error' };
      const result = formatErrorMessage(error);
      expect(result).toBe('An unknown error occurred');
    });
  });
});
