// Application constants

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN_TWO_FA: '/api/Authorization/LoginTwoFa',
    VERIFY_LOGIN_TWO_FA: '/api/Authorization/VerifyLoginTwoFa',
    REGISTER: '/api/Authorization/Register',
    IS_AUTHORIZED: '/api/Authorization/IsAuthorized',
    LOGOUT: '/api/Authorization/LogOut',
    GET_PROVIDERS: '/api/Authorization/GetProvidersLink',
    QR_SIGN_IN: '/api/Authorization/QrSignIn',
  },
  // User endpoints
  USER: {
    GET_INFO: '/api/user/getUserInfo',
    SEND_PHONE_CODE: '/api/user/sendPhoneConfirmationCode',
    VERIFY_PHONE_CODE: '/api/user/verifiPhoneConfirmationCode',
  },
  // Passkey endpoints
  PASSKEY: {
    BEGIN_REGISTRATION: '/api/passkey/BeginRegistration',
    FINISH_REGISTRATION: '/api/passkey/FinishRegistration',
    BEGIN_LOGIN: '/api/passkey/BeginLogin',
    FINISH_LOGIN: '/api/passkey/FinishLogin',
  },
} as const;

export const SIGNALR_HUBS = {
  QR_LOGIN: '/hub/qr-login',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  LOGIN_TWO_FA: '/LoginTwoFa',
  REGISTRATION: '/registration',
  PROFILE: '/profile',
} as const;

export const AUTH_METHODS = {
  TWO_FA: '2FA',
  PASSKEY: 'PassKey',
  QR: 'QR',
} as const;

export const COSE_ALGORITHM_MAP = {
  ES256: -7,
  RS256: -257,
  PS256: -37,
  ES384: -35,
  RS384: -258,
  PS384: -38,
  ES512: -36,
  RS512: -259,
  PS512: -39,
  EdDSA: -8,
} as const;
