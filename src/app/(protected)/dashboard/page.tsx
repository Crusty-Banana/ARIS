'use client';

import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  return (session?.user?.role === 'admin') ? (
    <div>
        admin dashboard
    </div>
  ) : (
    <div>
        user dashboard
    </div>
  );
}