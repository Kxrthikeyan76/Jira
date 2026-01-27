// app/layout.tsx (or app/providers.tsx if you have one)
"use client";
import './globals.css';
import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { initializeStorage } from '@/utils/initializeStorage';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize storage on app load
    initializeStorage();
  }, []);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}