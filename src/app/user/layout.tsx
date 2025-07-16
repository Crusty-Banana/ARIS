'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, User, LogOut } from 'lucide-react';

// Header Component
interface HeaderProps {
  username: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout }) => (
    <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-8 h-8 text-blue-500" />
                    <h1 className="text-xl font-bold text-gray-800">AL-1S - Your Allergy Man</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {username}
                    </span>
                    <button onClick={onLogout} className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors">
                        <LogOut className="w-5 h-5 mr-1" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </header>
);

/**
 * Provides a consistent layout for all user-facing pages.
 * Includes the main header and navigation tabs.
 */
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header username={`${session?.user?.firstName} ${session?.user?.lastName}`} onLogout={() => signOut({ callbackUrl: '/auth/login' })}  />
      <div className="flex flex-col items-center justify-start bg-gray-100 p-4 min-h-screen">
        <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <Link href="/user/dashboard" className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${pathname === '/user/dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    My Allergy Profile
                </Link>
                <Link href="/user/wiki" className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${pathname === '/user/wiki' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Allergy Wiki
                </Link>
            </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
