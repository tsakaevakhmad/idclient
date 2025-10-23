import { useContext } from 'react';
import { UserContext, UserContextType } from '../contexts/UserContext';

/**
 * Hook to access user context
 * @throws Error if used outside UserProvider
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
