// API Request and Response Types
import { User, AuthStatus, ExternalProvider } from '../../types';

// Auth API Types
export interface LoginTwoFaRequest {
  identifier: string;
}

export interface LoginTwoFaResponse {
  id: string;
  status: AuthStatus;
}

export interface VerifyLoginTwoFaRequest {
  id: string;
  code: string;
}

export interface VerifyLoginTwoFaResponse {
  status: AuthStatus;
}

export interface RegisterRequest {
  email: string;
  userName: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface RegisterResponse {
  status: AuthStatus;
}

export interface IsAuthorizedResponse {
  status: AuthStatus;
}

export interface GetProvidersResponse {
  providers: ExternalProvider[];
}

// User API Types
export interface UserInfoResponse {
  data: User;
}

export interface PhoneConfirmationResponse {
  status: string;
}

// Passkey API Types
export interface PasskeyCredentialCreationOptions {
  challenge: string | Uint8Array;
  rp: {
    name: string;
    id?: string;
  };
  user: {
    id: string | Uint8Array;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: string;
    alg: string | number;
  }>;
  timeout?: number;
  excludeCredentials: Array<{
    id: string | Uint8Array;
    type: string;
    transports?: string[];
  }>;
  authenticatorSelection: {
    authenticatorAttachment: string | null | undefined;
    requireResidentKey?: boolean;
    userVerification?: string;
  };
  attestation?: string;
}

export interface PasskeyAssertionOptions {
  challenge: string | Uint8Array;
  timeout?: number;
  rpId?: string;
  allowCredentials?: Array<{
    id: string | Uint8Array;
    type: string;
    transports?: string[];
  }>;
  userVerification?: string;
}

// QR Login Types
export interface QRLoginToken {
  token: string;
}

export interface QRSignInResponse {
  status: AuthStatus;
}

// Generic API Response
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
