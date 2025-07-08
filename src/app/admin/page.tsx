'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session.user?.role !== 'admin') {
      router.replace('/dashboard');
    }
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">
          Admin Dashboard
        </h1>
        <p>Welcome, {session?.user?.name}!</p>
        <p>Email: {session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
