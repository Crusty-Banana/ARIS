"use client"

import { User, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import LocaleDropdown from "./locale-change"

export default function Header() {
  const { status } = useSession();
  /* const [language, setLanguage] = useState<"vi" | "en">("en")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "vi" : "en"))
  } */

  return (
    <header className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 shadow-lg sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left side - ARIS text */}
        <div className="text-white text-2xl font-bold">ARIS</div>

        {/* Right side - Language switch and Profile */}
        <div className="flex items-center gap-4">
          {/* Language Switch */}
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:bg-white/20 flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{language === "en" ? "EN" : "VI"}</span>
          </Button> */}
          <LocaleDropdown />
          {/* Profile Dropdown */}
          {status === "authenticated" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 p-0">
                  <User className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>)}
        </div>
      </div>
    </header>
  )
}
