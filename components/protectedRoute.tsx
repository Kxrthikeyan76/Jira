"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hasPermission, Permission } from '@/app/lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: Permission;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredPermission,
  fallbackPath = '/dashboard' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for auth cookie
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
        
        if (!authCookie) {
          router.push('/login');
          return;
        }

        // Get user from sessionStorage
        const userData = sessionStorage.getItem('currentUser');
        if (!userData) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(userData);
        
        // Check permission
        if (!hasPermission(user, requiredPermission)) {
          console.warn(`Access denied: ${user.email} lacks permission: ${requiredPermission}`);
          alert(`Access Denied: You don't have permission to access this page.`);
          router.push(fallbackPath);
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure sessionStorage is populated
    setTimeout(checkAuth, 100);
  }, [router, requiredPermission, fallbackPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}