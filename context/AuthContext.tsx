// context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string; // ADD THIS: password is optional
  permissions?: any;
  status?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error reading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const isAdmin = user?.role === 'admin';

  const login = (userData: User) => {
    // FIXED: Use optional chaining and type check
    const { password, ...userWithoutPassword } = userData;
    const userToStore = {
      ...userWithoutPassword,
      permissions: userData.permissions || {}
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    setUser(userToStore);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedUser: User) => {
    // FIXED: Use optional chaining
    const { password, ...userWithoutPassword } = updatedUser;
    const userToStore = {
      ...userWithoutPassword,
      permissions: updatedUser.permissions || {}
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    setUser(userToStore);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAdmin, 
      login, 
      logout, 
      updateUser 
    }}>
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