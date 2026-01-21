// app/(app)/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="p-8">
      {/* Completely empty - just a blank page */}
    </div>
  );
}