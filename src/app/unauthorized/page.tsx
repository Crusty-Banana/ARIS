// app/unauthorized/page.tsx
import { auth } from "@/lib/auth"
import Link from "next/link"

export default async function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="mx-auto h-24 w-24 text-red-500">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Access Denied
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    You don't have permission to access this page.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
