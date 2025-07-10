'use client';

import { useSession, signOut } from 'next-auth/react';

export default function UserDashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <p>Welcome, {session?.user?.firstName} {session?.user?.lastName}!</p>
        <p>You have the role of: <strong>{session?.user?.role}</strong></p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}