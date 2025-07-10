import Link from 'next/link';

export default function DeniedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-red-500">Access Denied</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
        <Link
          href="/"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}