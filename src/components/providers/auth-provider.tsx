'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};