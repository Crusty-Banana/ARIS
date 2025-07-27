'use client';

import { useSession } from 'next-auth/react';
import AdminDashboard from './_components/AdminDashboard/page';

export default function Home() {
  const { data: session } = useSession();
  return (session?.user?.role === 'admin') ? (
    <AdminDashboard/>
  ) : (
    <div>
        user dashboard
    </div>
  );
}