import { useState, useCallback, useEffect } from 'react';
import { sessionService } from '../services';
import { UserSessionDto, RevokeAllSessionsResponse } from '../api/types';

interface UseUserSessionsReturn {
  sessions: UserSessionDto[];
  loading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllExceptCurrent: () => Promise<RevokeAllSessionsResponse | void>;
  refreshSessions: () => Promise<void>;
}

/**
 * Custom hook for managing user login sessions (devices)
 */
export const useUserSessions = (): UseUserSessionsReturn => {
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user's login sessions
   */
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getMyUserSessions();
      setSessions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sessions';
      setError(errorMessage);
      console.error('Error in useUserSessions.fetchSessions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Revoke a specific session
   */
  const revokeSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await sessionService.revokeUserSession(sessionId);
      // Remove the session from local state
      setSessions((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke session';
      setError(errorMessage);
      console.error('Error in useUserSessions.revokeSession:', err);
      throw err; // Re-throw to allow component-level error handling
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Revoke all sessions except the current one (logout from all other devices)
   */
  const revokeAllExceptCurrent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sessionService.revokeAllUserSessionsExceptCurrent();
      // Refresh sessions to reflect the changes
      await fetchSessions();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke all sessions';
      setError(errorMessage);
      console.error('Error in useUserSessions.revokeAllExceptCurrent:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  /**
   * Refresh sessions
   */
  const refreshSessions = useCallback(async () => {
    await fetchSessions();
  }, [fetchSessions]);

  // Auto-fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    revokeSession,
    revokeAllExceptCurrent,
    refreshSessions,
  };
};

export default useUserSessions;
