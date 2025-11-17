// Utility functions

/**
 * Decodes a Base64URL-encoded string
 * @param input - Base64URL encoded string
 * @returns Decoded string
 */
export function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  return atob(base64);
}

/**
 * Converts a Base64URL string to Uint8Array
 * @param base64Url - Base64URL encoded string
 * @returns Uint8Array buffer
 */
export function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const len = binary.length;
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}

/**
 * Formats an error message for display
 * @param error - Error object
 * @returns Formatted error message
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Gets the redirect URL with query parameters for OAuth flow
 * @param params - Query parameters string
 * @returns Full redirect URL
 */
export function getOAuthRedirectUrl(params: string): string {
  const baseUri = window.location.origin;
  return `${baseUri}/connect/authorize/?${params}`;
}
