"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FiHome, 
  FiFolder, 
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiMessageSquare
} from "react-icons/fi";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: FiHome,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FiFolder,
    },
    {
      label: "Team Members",
      href: "/users",
      icon: FiUsers,
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: FiCalendar,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: FiBarChart2,
    },
  ];

  const bottomNavItems = [
    {
      label: "Notifications",
      href: "/notifications",
      icon: FiBell,
      badge: 3
    },
    {
      label: "Messages",
      href: "/messages",
      icon: FiMessageSquare,
      badge: 2
    },
    {
      label: "Settings",
      href: "/settings",
      icon: FiSettings,
    },
  ];

  const currentUser = {
    name: "User",
    email: "alex@example.com",
    avatar: "AJ",
    role: "Admin"
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col
      ${isOpen ? "w-64" : "w-52"}`} // Changed from w-20 to w-52 for text visibility
    >
      {/* Logo */}
      <div className={`p-6 border-b border-gray-200 ${!isOpen && "px-4 py-6"}`}>
        {isOpen ? (
          <>
            <h1 className="text-xl font-bold text-gray-900">TrackFlow</h1>
            <p className="text-gray-500 text-sm">Project Management</p>
          </>
        ) : (
          <div>
            <h1 className="text-xl font-bold text-gray-900">TrackFlow</h1>
          
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:border-l-4 hover:border-gray-200"
                  }
                  ${!isOpen ? "px-3" : ""}`} // Keep padding for text
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-500"}`} />
                <span className={`${!isOpen ? "truncate text-sm" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8">
          <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3
            ${!isOpen ? "truncate" : ""}`}>
            {isOpen ? "Quick Stats" : "Stats"}
          </h3>
          <div className="space-y-2 px-3">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between items-center py-1">
                <span className={!isOpen ? "truncate text-xs" : ""}>Active Projects</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className={!isOpen ? "truncate text-xs" : ""}>Team Members</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className={!isOpen ? "truncate text-xs" : ""}>Tasks Today</span>
                <span className="font-semibold">24</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        {/* Bottom Navigation Icons */}
        <div className={`flex ${isOpen ? "justify-around" : "justify-between px-2"}`}>
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors
                  ${active ? "text-blue-600 bg-blue-50" : ""}`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile */}
        <Link
          href={`/profile`}
          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group
            ${!isOpen ? "" : ""}`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {currentUser.avatar}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">
              {currentUser.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {currentUser.role}
            </div>
          </div>
          
          <div className="text-gray-400 group-hover:text-gray-600 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </aside>
  );
}