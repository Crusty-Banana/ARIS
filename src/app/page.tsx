import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to ARIS</h1>
        <p className="text-xl mb-8 opacity-90">Allergen Reporting & Information System</p>
        <Link href="/dashboard">
          <Button className="bg-white text-cyan-600 hover:bg-gray-100 font-medium px-8 py-3 text-lg">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}
