import { useState, useCallback, useEffect } from 'react';
import { sessionService } from '../services';
import { AuthorizationSession } from '../api/types';

interface UseSessionsReturn {
  sessions: AuthorizationSession[];
  loading: boolean;
  error: string | null;
  fetchSessions: (status?: string) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
}

/**
 * Custom hook for managing user authorization sessions
 */
export const useSessions = (): UseSessionsReturn => {
  const [sessions, setSessions] = useState<AuthorizationSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user's authorization sessions
   */
  const fetchSessions = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sessionService.getMySessions(status);
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sessions';
      setError(errorMessage);
      console.error('Error in useSessions.fetchSessions:', err);
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
      await sessionService.revokeSession(sessionId);
      // Remove the session from local state
      setSessions((prevSessions) => prevSessions.filter((session) => session.id !== sessionId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke session';
      setError(errorMessage);
      console.error('Error in useSessions.revokeSession:', err);
      throw err; // Re-throw to allow component-level error handling
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh sessions (fetch without status filter)
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
    refreshSessions,
  };
};

export default useSessions;
