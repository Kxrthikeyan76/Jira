"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Right side: Header + Page */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page content area */}
        <main
          className="
            flex-1 
            min-w-0 
            overflow-x-hidden 
            overflow-y-auto 
            
            flex 
            flex-col 
            pb-20
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
