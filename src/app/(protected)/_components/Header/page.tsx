"use client"

import { User, LogOut, MessageSquareWarning, Blocks } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import LocaleDropdown from "./_components/locale-change"
import { useTranslations } from "next-intl"
import React, { useState } from "react"
import { AddRecommendationModal } from "./_components/recommend-modal"
import { useRouter } from "next/navigation"

export default function Header() {
  const t = useTranslations('header');
  const { data, status } = useSession();
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <React.Fragment>
      <header className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <div className="text-white text-2xl font-bold">ARIS</div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-white hover:bg-white/30 text-lg px-6 py-2"
            onClick={() => router.push("/dashboard")}
          >
            <Blocks className="h-6 w-6" />
            <span>{t('dashboard')}</span>
          </Button>

          <div className="flex items-center gap-4 ml-auto">
            {/* <Button */}
            {/*   variant="ghost" */}
            {/*   className="flex items-center gap-2 text-white hover:bg-white/30" */}
            {/*   onClick={() => router.push("/dashboard")} */}
            {/* > */}
            {/*   <Blocks className="h-5 w-5" /> */}
            {/*   <span>{t('dashboard')}</span> */}
            {/* </Button> */}

            <LocaleDropdown />
            {status === "authenticated" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 p-0">
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuItem className="cursor=pointer" onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                  </DropdownMenuItem>

                  {data.user.role === "user" && (
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowFeedback(true)}>
                      <MessageSquareWarning className="mr-2 h-4 w-4" />
                      <span>{t("feedback")}</span>
                    </DropdownMenuItem>)}

                  <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>


                </DropdownMenuContent>
              </DropdownMenu>)}
          </div>
        </div>
      </header>

      <AddRecommendationModal open={showFeedback} onClose={() => setShowFeedback(false)} />
    </React.Fragment>
  )
}