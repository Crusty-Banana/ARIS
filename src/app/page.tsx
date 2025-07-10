'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">Welcome!</h1>
          <p>You are not logged in.</p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}