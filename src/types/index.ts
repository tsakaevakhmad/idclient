// Shared types across the application

export interface User {
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface ExternalProvider {
  name: string;
  displayName: string;
  url: string;
}

export type AuthMethod = '2FA' | 'PassKey' | 'QR';

export type AuthStatus =
  | 'Success'
  | 'SendedMailConfirmationCode'
  | 'SendedPhoneNumberConfirmationCode'
  | 'SendedLoginCodeToEmail'
  | 'SendedLoginCodeToPhoneNumber'
  | 'UserNotFound'
  | 'UserMailNotConfirmed'
  | 'UserPhoneNotConfirmed'
  | 'UserAlreadyExists'
  | 'UserMailAlreadyExists'
  | 'UserPhoneAlreadyExists'
  | 'InvalidToken'
  | 'Error'
  | 'UserIsBlocked';
