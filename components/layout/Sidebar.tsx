"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaUsers, 
  FaChartBar, 
  FaCog,
  FaSignOutAlt,
  FaUserShield,
  FaUserTie,
  FaUser,
  FaEye,
  FaProjectDiagram,
  FaTachometerAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { useEffect, useState, useMemo } from 'react';

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem('currentUser');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserEmail');
    router.push('/login');
  };

  const navItems: NavItem[] = useMemo(() => [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <FaTachometerAlt />, 
      roles: ['admin', 'manager', 'user', 'viewer']
    },
    { 
      path: '/users', 
      label: 'Users', 
      icon: <FaUsers />, 
      roles: ['admin', 'manager', 'user', 'viewer']
    },
    { 
      path: '/projects', 
      label: 'Projects', 
      icon: <FaProjectDiagram />, 
      roles: ['admin', 'manager', 'user', 'viewer']
    },
    { 
      path: '/reports', 
      label: 'Reports', 
      icon: <FaChartBar />, 
      roles: ['admin', 'manager']
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: <FaCog />, 
      roles: ['admin']
    },
  ], []);

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return <FaUserShield className="text-red-500" />;
      case 'manager': return <FaUserTie className="text-blue-500" />;
      case 'user': return <FaUser className="text-green-500" />;
      case 'viewer': return <FaEye className="text-gray-500" />;
      default: return <FaUser />;
    }
  };

  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    return navItems.filter(item => item.roles.includes(user.role || 'user'));
  }, [user, navItems]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Prevent scroll propagation to parent
  const handleScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    const element = e.currentTarget;
    const isAtTop = element.scrollTop === 0;
    const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    
    // Only prevent default if we can still scroll in the current direction
    if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
      e.preventDefault();
    }
  };

  if (!user) {
    return (
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-full bg-white border-r transition-all duration-300`}>
        <div className="animate-pulse h-full">
          <div className="h-16 bg-gray-200"></div>
          <div className="p-4 space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-full flex flex-col bg-white border-r transition-all duration-300 relative`}>
      {/* Fixed Header */}
      <div className="h-16 border-b flex items-center justify-between px-4 flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">TF</span>
            </div>
            <span className="font-bold text-gray-800 whitespace-nowrap">TrackFlow</span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto">
            <span className="text-xl font-bold text-white">TF</span>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-white border shadow-md hover:bg-gray-50 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FaChevronRight className="text-gray-600" />
          ) : (
            <FaChevronLeft className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Scrollable Content Area - with scroll isolation */}
      <div 
        className="flex-1 overflow-y-auto"
        onWheel={handleScroll}
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="py-4">
          {/* Navigation Section */}
          <div className="mb-2 px-4">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Main Menu
              </h3>
            )}
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-medium border-l-3 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 border-l-3 border-transparent'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className={`text-lg ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-sm whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="border-t bg-white flex-shrink-0">
        {!isCollapsed ? (
          <>
            {/* Role info - Full version */}
            <div className="p-3 border-b">
              <div className="flex items-center gap-2">
                {getRoleIcon(user.role || 'user')}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
            >
              <FaSignOutAlt />
              <span className="text-sm">Logout</span>
            </button>
          </>
        ) : (
          // Collapsed version - Only icons
          <>
            {/* Role info - Icon only */}
            <div className="p-3 border-b flex justify-center">
              <div title={`${user.name || user.email} (${user.role})`}>
                {getRoleIcon(user.role || 'user')}
              </div>
            </div>

            {/* Logout button - Icon only */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-3 text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </>
        )}
      </div>
    </div>
  );
}