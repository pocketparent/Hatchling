// File: src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

/**
 * React hook to get the current Firebase Authentication user state.
 */
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({ user, loading: false, error: null });
      },
      (error) => {
        console.error('Auth state change error:', error);
        setAuthState({ user: null, loading: false, error });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return authState;
}

