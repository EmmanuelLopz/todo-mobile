import { getToken } from '@/services/authService';
import { setLogoutHandler } from '@/services/api';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  setIsAuthenticated: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for a stored idToken on startup to restore session
    const checkToken = async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
    };
    checkToken();

    // When the api interceptor can't refresh the token, mark the user as
    // logged out — the route guard will redirect to the login screen.
    setLogoutHandler(() => setIsAuthenticated(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
