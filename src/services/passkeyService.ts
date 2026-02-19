import { apiClient } from '../api/client';
import { API_ENDPOINTS, COSE_ALGORITHM_MAP } from '../constants';
import { base64UrlToUint8Array } from '../utils';
import {
  PasskeyCredentialCreationOptions,
  PasskeyAssertionOptions,
  FidoCredentialDto,
} from '../api/types';

/**
 * Convert ArrayBuffer to base64url string
 * Required because Safari doesn't support PublicKeyCredential.toJSON()
 */
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Passkey Service
 * Handles WebAuthn credential creation and authentication
 */
class PasskeyService {
  /**
   * Register a new passkey for the current user
   */
  async registerPasskey(passkeyName?: string): Promise<void> {
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
      const credential = (await navigator.credentials.create({
        publicKey: publicKey as PublicKeyCredentialCreationOptions,
      })) as PublicKeyCredential;

      // Manually serialize - Safari doesn't support PublicKeyCredential.toJSON()
      const attestationResponse = credential.response as AuthenticatorAttestationResponse;
      const serialized = {
        id: credential.id,
        rawId: arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64Url(attestationResponse.attestationObject),
          clientDataJSON: arrayBufferToBase64Url(attestationResponse.clientDataJSON),
        },
        passkeyName: passkeyName || undefined,
      };

      // Send credential to server
      await apiClient.post(API_ENDPOINTS.PASSKEY.FINISH_REGISTRATION, serialized);
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

      // Convert challenge from base64url to Uint8Array
      options.challenge = base64UrlToUint8Array(options.challenge as string);

      // Convert allowed credential IDs
      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred) => {
          const mapped = {
            ...cred,
            id: base64UrlToUint8Array(cred.id as string),
          };
          // Remove transports if it's not an array
          if (!Array.isArray(mapped.transports)) {
            delete mapped.transports;
          }
          return mapped;
        });
      }

      // Get credential using WebAuthn API
      const credential = (await navigator.credentials.get({
        publicKey: options as PublicKeyCredentialRequestOptions,
      })) as PublicKeyCredential;

      // Manually serialize - Safari doesn't support PublicKeyCredential.toJSON()
      const assertionResponse = credential.response as AuthenticatorAssertionResponse;
      const serialized = {
        id: credential.id,
        rawId: arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          authenticatorData: arrayBufferToBase64Url(assertionResponse.authenticatorData),
          clientDataJSON: arrayBufferToBase64Url(assertionResponse.clientDataJSON),
          signature: arrayBufferToBase64Url(assertionResponse.signature),
          userHandle: assertionResponse.userHandle
            ? arrayBufferToBase64Url(assertionResponse.userHandle)
            : null,
        },
      };

      // Send credential to server
      const result = await apiClient.post(API_ENDPOINTS.PASSKEY.FINISH_LOGIN, serialized);
      return result;
    } catch (error) {
      console.error('Passkey login error:', error);
      throw error;
    }
  }
  /**
   * Get list of user's registered passkeys
   */
  async getPasskeys(): Promise<FidoCredentialDto[]> {
    try {
      const response = await apiClient.get<FidoCredentialDto[]>(API_ENDPOINTS.USER.GET_PASSKEYS);
      return response.data;
    } catch (error) {
      console.error('Get passkeys error:', error);
      throw error;
    }
  }

  /**
   * Delete a passkey by ID
   */
  async deletePasskey(passkeyId: string): Promise<void> {
    try {
      await apiClient.delete(
        `${API_ENDPOINTS.USER.DELETE_PASSKEY}?passkeyId=${encodeURIComponent(passkeyId)}`
      );
    } catch (error) {
      console.error('Delete passkey error:', error);
      throw error;
    }
  }
}

export const passkeyService = new PasskeyService();
