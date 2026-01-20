"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiFolder } from "react-icons/fi";

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
      label: "board",
      href: "/board",
      icon: FiFolder,
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300
      ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
    >
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
