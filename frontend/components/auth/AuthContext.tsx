'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Doctor {
  name: string;
}

interface AuthContextType {
  doctor: Doctor | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const login = async (username: string, password: string) => {
    // This is a dummy authentication
    // In a real app, this would make an API call to your backend
    if (username === 'admin' && password === 'vtehr') {
      setDoctor({ name: 'Dr. Ilponen' });
      return true;
    }
    return false;
  };

  const logout = () => {
    // Clear all transcription data from localStorage
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('transcription_')) {
          localStorage.removeItem(key);
        }
      });
    }
    setDoctor(null);
  };

  return (
    <AuthContext.Provider value={{ doctor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 