import { createContext, useContext } from 'react';
import type { CurrentUserDto, LoginRequest, RegisterRequest } from '../../../types/api';

export interface AuthContextValue {
  user: CurrentUserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  sessionExpired: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearSessionExpired: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
