// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiFolder, 
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiUser,
  FiMenu,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(true); // ALWAYS start as open

  // On mount, ONLY check for user, NOT sidebar state
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // IGNORE any stored sidebar state - ALWAYS open on refresh
    // setIsOpen(true); // Already true by default
    
    // If you want to clear any previous stored state:
    localStorage.removeItem('sidebarOpen');
  }, []);

  // Save sidebar state to localStorage when user changes it
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', newState.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sidebarOpen');
    router.push('/login');
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: FiHome },
    { label: "Projects", href: "/projects", icon: FiFolder },
    { label: "Team Members", href: "/users", icon: FiUsers },
    { label: "Calendar", href: "/calendar", icon: FiCalendar },
    { label: "Reports", href: "/reports", icon: FiBarChart2 },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      {/* When sidebar is OPEN */}
      {isOpen ? (
        <div className="flex flex-col bg-white border-r border-gray-200 h-screen w-64 transition-all duration-300">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">TrackFlow</h1>
              <p className="text-gray-500 text-sm">Project Management</p>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Close sidebar"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation with separate scrollbar */}
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${
                      active 
                        ? "bg-blue-50 text-blue-700" 
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                Quick Stats
              </h3>
              <div className="space-y-2 px-3">
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between items-center py-1">
                    <span>Active Projects</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Team Members</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Tasks Today</span>
                    <span className="font-semibold">24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t">
            {user ? (
              <>
                <Link
                  href={`/users/${user.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.role}</div>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 w-full mt-2"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium text-sm">Not logged in</div>
                  <div className="text-xs text-gray-500">Click to login</div>
                </div>
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* When sidebar is CLOSED - COMPLETELY HIDDEN except toggle button */
        <div className="h-screen flex items-center justify-center border-r border-gray-200 bg-white w-16">
          <button
            onClick={toggleSidebar}
            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Open sidebar"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile Menu Button - Always visible on mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        title="Toggle sidebar"
      >
        <FiMenu className="w-5 h-5" />
      </button>
    </>
  );
}