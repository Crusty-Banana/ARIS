"use client"

import { User, LogOut, Trash2 } from "lucide-react" // Add Trash2 icon
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import LocaleDropdown from "./locale-change"
import { useTranslations } from "next-intl"

export default function Header() {
  const t = useTranslations('header');
  const { data: session, status } = useSession(); // Get the user session data

  // Handle the delete user logic
  const handleDeleteUser = async () => {
    if (!session?.user?.id) {
      console.error("User ID not found in session.");
      return;
    }

    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      try {
        const res = await fetch(`/api/user/${session.user.id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // Sign the user out after successful deletion
          alert("Your account has been successfully deleted.");
          await signOut({ callbackUrl: '/' }); 
        } else {
          const errorData = await res.json();
          alert(`Failed to delete account: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("An error occurred while trying to delete your account.");
      }
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 shadow-lg sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="text-white text-2xl font-bold">ARIS</div>
        <div className="flex items-center gap-4">
          <LocaleDropdown />
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
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator /> {/* Add a separator for better UI */}
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:bg-red-100" 
                  onClick={handleDeleteUser}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{t('deleteAccount')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}