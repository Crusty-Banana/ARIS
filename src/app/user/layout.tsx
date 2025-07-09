// app/(admin)/layout.tsx
import { requireRole } from "@/lib/rbac"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await requireRole('user')

    return (
        <div className="flex min-h-screen">
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    )
}
