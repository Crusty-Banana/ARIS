'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-4 text-2xl font-bold">Welcome to your Dashboard</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-white bg-red-500 rounded"
      >
        Logout
      </button>
    </div>
  );
}