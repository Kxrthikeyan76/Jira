// app/(app)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaBell, 
  FaCog, 
  FaSignOutAlt,
  FaChartBar
} from "react-icons/fa";
import {
  Button,
  Heading,
  Text,
  Container
} from "@/components/ui";
import Link from "next/link";

type User = {
  name: string;
  email: string;
  role: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("currentUser");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Auth check error:", error);
        // Clear everything and redirect
        sessionStorage.clear();
        localStorage.clear();
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = "/login";
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserEmail");
    router.push("/login");
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text className="text-gray-600">Loading...</Text>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <Container size="xl">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 from-blue-600 to-purple-600 flex items-center justify-center">
                <FaChartBar className="text-xl text-white" />
              </div>
              <div>
                <Heading level={3} className="text-gray-800">Dashboard</Heading>
                <Text size="xs" variant="muted">Welcome to your workspace</Text>
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <FaBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Settings */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <FaCog size={20} />
              </button>
              
              {/* User profile dropdown */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <Text size="sm" className="font-medium text-gray-800">{user.name}</Text>
                  <Text size="xs" variant="muted" className="capitalize">{user.role}</Text>
                </div>
                
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-blue-600 from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer">
                    {getUserInitials(user.name)}
                  </div>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3 border-b">
                      <Text size="sm" className="font-medium">{user.name}</Text>
                      <Text size="xs" variant="muted">{user.email}</Text>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Welcome section only */}
      <Container size="xl" className="py-8">
        <div className="mb-8">
          <Heading level={1}>
            Good morning, {user.name}! <span className="text-3xl">👋</span>
          </Heading>
          <Text variant="muted" className="text-lg mt-2">
            Welcome back to your dashboard.
          </Text>
        </div>
      </Container>
    </div>
  );
}