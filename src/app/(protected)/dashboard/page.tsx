'use client';

import { useSession } from 'next-auth/react';
import AdminDashboard from './_components/AdminDashboard/page';
import AuthPage from '@/components/authen-page';
import UserDashboard from './_components/UserDashboard/page';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return <AuthPage />;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (session?.user?.role === 'admin') ? (
    <AdminDashboard />
  ) : (
    <UserDashboard />
  );
}