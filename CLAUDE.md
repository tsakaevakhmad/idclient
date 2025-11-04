# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript + React authentication frontend (`idclient`) that integrates with an ASP.NET Core backend. Built with modern best practices including TypeScript strict mode, Context API for state management, custom hooks, comprehensive error handling, and full test coverage.

**Key Technologies**: React 19, TypeScript, Material-UI, Tailwind CSS, Framer Motion, SignalR, WebAuthn, i18next (4 languages)

## Development Commands

### Starting Development

```bash
npm start                  # Dev server on http://localhost:3000
npm run build:css          # Tailwind CSS watch mode (parallel with dev)
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier
```

### Building and Testing

```bash
npm run build              # Production build
npm test                   # Run tests in watch mode
```

### Code Quality

Pre-commit hooks automatically run linting and formatting via `husky` and `lint-staged`.

### Docker

```bash
docker build -t idclient .
docker run -p 3000:3000 idclient
```

## Architecture

### Project Structure

```
src/
├── api/                    # API client and types
│   ├── client.ts          # Axios instance with interceptors
│   └── types/             # API request/response interfaces
├── components/
│   ├── common/            # Reusable UI (LoadingButton, ErrorBoundary, etc.)
│   ├── features/          # Feature-specific components
│   │   ├── auth/          # Login, Registration, 2FA, QR
│   │   └── profile/       # Profile management
│   ├── animations/        # PageTransition, SkeletonLoader
│   ├── glass/             # Glassmorphism components
│   └── theme/             # Theme-related UI components
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   ├── UserContext.tsx    # User profile state
│   └── ThemeContext.tsx   # Theme and styling state
├── hooks/                 # Custom hooks
│   ├── useAuth.ts         # Access auth context
│   ├── useUser.ts         # Access user context
│   ├── useQRLogin.ts      # SignalR QR login logic
│   ├── usePasskey.ts      # WebAuthn operations
│   ├── useTheme.ts        # Theme configuration access
│   └── useLanguage.ts     # i18n language switching
├── services/              # API service layer
│   ├── authService.ts     # Auth endpoints
│   ├── passkeyService.ts  # WebAuthn API calls
│   └── userService.ts     # User management
├── types/                 # Shared TypeScript types
├── utils/                 # Helper functions
├── constants/             # API endpoints, routes, etc.
├── i18n/                  # Internationalization
│   └── config.ts          # i18next configuration
├── locales/               # Translation files (en, ru, kg, tr)
│   ├── en/                # English translations
│   ├── ru/                # Russian translations
│   ├── kg/                # Kyrgyz translations
│   └── tr/                # Turkish translations
├── themes/                # Theme definitions
└── __tests__/            # Test files
```

### State Management with Context API

**AuthContext** manages authentication state (isAuthenticated, login, logout, checkAuth, externalProviders)
**UserContext** manages user profile data and verification (user, fetchUserInfo, verifyPhoneCode)
**ThemeContext** manages UI themes with 6 variants (warmRustic, oceanGlass, classicLight, darkGlass, midnightGlass, classicDark)

Access via custom hooks: `useAuth()`, `useUser()`, and `useTheme()`. All components consume these hooks instead of prop drilling.

### Service Layer Architecture

Services are TypeScript classes with typed methods. The centralized **API client** (`api/client.ts`) provides:

- Axios instance with interceptors for requests/responses
- Automatic error handling and transformation
- Cookie-based credentials (`withCredentials: true`)
- Typed request/response interfaces

**Service Structure**:

- `authService`: Login, registration, authorization checks, OAuth providers
- `passkeyService`: WebAuthn registration and authentication
- `userService`: User profile, phone verification

All endpoints defined in `constants/index.ts` for easy maintenance.

### Custom Hooks Pattern

Business logic extracted into reusable hooks:

- **useQRLogin**: Encapsulates entire SignalR connection lifecycle, session management, and authentication flow
- **usePasskey**: Handles WebAuthn registration and login with loading states
- **useAuth/useUser**: Context accessors with error handling if used outside provider
- **useTheme**: Access theme configuration for glassmorphism effects
- **useLanguage**: Manage i18n language switching with persistence

### Authentication Flows

1. **2FA**: `LoginTwoFa` → API sends code → `LoginTwoFaVerify` → OTP input → Success
2. **Passkey**: Button click → `usePasskey` hook → WebAuthn ceremony → Auto-login
3. **QR**: `useQRLogin` establishes SignalR connection → Displays QR → Mobile scans → Token received → Login
4. **OAuth**: External providers loaded via AuthContext → User clicks → Redirects to provider → Returns with params → Redirect to `/connect/authorize`

### SignalR Real-time (QR Login)

Hub: `/hub/qr-login`
Events: `ReceiveSessionId` (server → client), `QrScaned` (server → client with JWT)
Implementation: `useQRLogin` hook manages connection, handles events, auto-reconnect, and cleanup on unmount

### Routing & Code Splitting

Routes defined in `constants/index.ts`:

- `/` - Login (lazy loaded)
- `/registration` - Registration (lazy loaded)
- `/profile` - User profile (lazy loaded)

All route components use `React.lazy()` with `Suspense` showing `LoadingSpinner`.

**OAuth Redirect Logic**: After auth, if URL has query params → redirect to `REACT_APP_BASE_URI/connect/authorize/?{params}`. Otherwise → navigate to `/profile`.

### WebAuthn (Passkey) Implementation

`passkeyService.ts` handles browser API transformations:

- Convert `challenge` and `user.id` from base64url → Uint8Array
- Map algorithm names to COSE identifiers using `COSE_ALGORITHM_MAP`
- Process `excludeCredentials` with base64url decoding
- Handle `authenticatorAttachment: null` → `undefined`
- Send serialized credential to backend for validation

### Internationalization (i18n)

**Supported Languages**: English (en), Russian (ru), Kyrgyz (kg), Turkish (tr)

- Configured with `i18next` and `react-i18next` in `i18n/config.ts`
- Language detection via browser and localStorage persistence
- All UI strings in `locales/[lang]/translation.json` (4 languages: en, ru, kg, tr)
- Access translations via `useTranslation()` hook
- Language switching via `useLanguage()` custom hook with localStorage persistence

### Theme System

**6 Glassmorphism Themes** with smooth transitions:

- `warmRustic` - Default warm theme with natural tones
- `oceanGlass` - Cool blue oceanic theme
- `classicLight` - Clean light theme
- `darkGlass` - Modern dark glass theme
- `midnightGlass` - Deep blue midnight theme
- `classicDark` - Classic dark theme

Each theme defines colors, glass effects (blur, opacity), gradients, and animations. Theme state persisted in localStorage.

### TypeScript Configuration

Strict mode enabled with path aliases:

- `@components/*` → `src/components/*`
- `@services/*` → `src/services/*`
- `@hooks/*` → `src/hooks/*`
- `@contexts/*` → `src/contexts/*`
- `@api/*` → `src/api/*`
- `@types/*` → `src/types/*`
- `@utils/*` → `src/utils/*`
- `@constants/*` → `src/constants/*`

All types defined in `types/` and `api/types/`. API responses fully typed.

### Error Handling

- **ErrorBoundary**: Catches React errors, displays user-friendly message
- **API Client Interceptors**: Transform API errors into consistent `ApiError` format
- **Service Layer**: Try/catch with logging and error propagation
- **Contexts**: Error state management for async operations

### Testing

**Test Utilities** (`__tests__/utils/test-utils.tsx`): Custom render function wrapping components with all providers (Router, AuthProvider, UserProvider)

**Test Structure**:

- Unit tests for services (mocked API client)
- Unit tests for utility functions
- Component tests using React Testing Library
- Custom render with provider wrappers

Run tests: `npm test`

### UI Framework

- **Material-UI (MUI)**: Cards, Buttons, TextFields, Dialogs, Icons
- **Tailwind CSS**: Utility classes for layouts and spacing
- **Framer Motion**: `motion.div`, `AnimatePresence` for transitions
- **Custom Components**: `LoadingButton`, `LoadingSpinner`, `AnimatedCard`, `ErrorBoundary`
- **Glassmorphism**: `GlassCard`, `GlassButton`, `GlassInput` with backdrop blur effects

### Environment Variables

`.env` file:

- `REACT_APP_BASE_URI` - Backend server URL (default: https://localhost:7253)

## Main Branch

The main branch for pull requests is `main` (not `master`).
