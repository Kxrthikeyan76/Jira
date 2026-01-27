// app/(app)/layout.tsx
"use client";

import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Now has toggle functionality */}
      <Sidebar />
      
      {/* Main content - Will adjust automatically */}
      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}