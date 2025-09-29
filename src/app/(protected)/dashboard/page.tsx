"use client";

import { useSession } from "next-auth/react";
import AdminDashboard from "./_components/AdminDashboard/page";
import AuthPage from "./_components/AuthPage/page";
import UserDashboard from "./_components/UserDashboard/page";
import LoadingScreen from "@/components/loading-screen";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return <AuthPage />;
  }

  if (status === "loading") {
    return <LoadingScreen />;
  }

  return session?.user?.role === "admin" ? (
    <AdminDashboard />
  ) : (
    <UserDashboard />
  );
}
