"use client";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import AuthPage from "../_components/AuthPage/page";
import LoadingScreen from "@/components/loading-screen";
import BetaMenu from "./_components/betamenu/page";
export default function Beta() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const myFeatures = [
    { label: "OCR", onClick: () => router.push("/beta/ocr") },
    { label: "New Feature B", onClick: () => console.log("B clicked!") },
    { label: "Experimental C", onClick: () => alert("Welcome to C") },
  ];

  if (status === "unauthenticated") {
    return <AuthPage />;
  }

  if (status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <div>
      <BetaMenu features={myFeatures} />
    </div>
  );
}
