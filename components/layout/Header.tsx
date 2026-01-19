"use client";

import { useRouter } from "next/navigation";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Later: clear auth / token
    router.push("/login");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      
      {/* Left: Menu + App Name */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="text-gray-700 text-xl mr-4"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-gray-800">
          TrackFlow
        </h1>
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
      >
        Logout
      </button>
    </header>
  );
}
