import { apiClient } from '../api/client';
import { API_ENDPOINTS, COSE_ALGORITHM_MAP } from '../constants';
import { base64UrlToUint8Array } from '../utils';
import { PasskeyCredentialCreationOptions, PasskeyAssertionOptions } from '../api/types';

/**
 * Passkey Service
 * Handles WebAuthn credential creation and authentication
 */
class PasskeyService {
  /**
   * Register a new passkey for the current user
   */
  async registerPasskey(): Promise<void> {
    try {
      // Get registration options from server
      const optionsResponse = await apiClient.post<PasskeyCredentialCreationOptions>(
        API_ENDPOINTS.PASSKEY.BEGIN_REGISTRATION,
        null,
        {
          headers: { 'Content-Type': 'application/json-patch+json' },
        }
      );

      const publicKey = optionsResponse.data;

      // Convert challenge and user.id from base64url to Uint8Array
      publicKey.challenge = base64UrlToUint8Array(publicKey.challenge as string);
      publicKey.user.id = base64UrlToUint8Array(publicKey.user.id as string);

      // Map algorithm names to COSE identifiers
      publicKey.pubKeyCredParams = publicKey.pubKeyCredParams.map((param) => ({
        type: param.type,
        alg:
          COSE_ALGORITHM_MAP[param.alg as keyof typeof COSE_ALGORITHM_MAP] ||
          (param.alg as unknown as number),
      }));

      // Convert excluded credential IDs
      for (const exCred of publicKey.excludeCredentials) {
        exCred.id = base64UrlToUint8Array(exCred.id as string);
      }

      // Handle null authenticatorAttachment
      if (publicKey.authenticatorSelection.authenticatorAttachment === null) {
        publicKey.authenticatorSelection.authenticatorAttachment = undefined as unknown as string;
      }

      // Create credential using WebAuthn API
      const credential = await navigator.credentials.create({
        publicKey: publicKey as PublicKeyCredentialCreationOptions,
      });

      // Send credential to server
      await apiClient.post(API_ENDPOINTS.PASSKEY.FINISH_REGISTRATION, credential);
    } catch (error) {
      console.error('Passkey registration error:', error);
      throw error;
    }
  }

  /**
   * Login using passkey
   */
  async loginPasskey() {
    try {
      // Get login options from server
      const optionsResponse = await apiClient.post<PasskeyAssertionOptions>(
        API_ENDPOINTS.PASSKEY.BEGIN_LOGIN,
        {},
        {
          headers: { 'Content-Type': 'application/json-patch+json' },
        }
      );

      const options = optionsResponse.data;

      // Convert challenge from base64 to Uint8Array
      options.challenge = Uint8Array.from(atob(options.challenge as string), (c) =>
        c.charCodeAt(0)
      );

      // Convert allowed credential IDs
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred) => {
          const mapped = {
            ...cred,
            id: Uint8Array.from(atob(cred.id as string), (c) => c.charCodeAt(0)),
          };
          // Remove transports if it's not an array
          if (!Array.isArray(mapped.transports)) {
            delete mapped.transports;
          }
          return mapped;
        });
      }

      // Get credential using WebAuthn API
      const credential = await navigator.credentials.get({
        publicKey: options as PublicKeyCredentialRequestOptions,
      });

      // Send credential to server
      const result = await apiClient.post(API_ENDPOINTS.PASSKEY.FINISH_LOGIN, credential);
      return result;
    } catch (error) {
      console.error('Passkey login error:', error);
      throw error;
    }
  }
}

export const passkeyService = new PasskeyService();
