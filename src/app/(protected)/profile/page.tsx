import { getServerSession } from "next-auth";
import { ProfilePage } from "./_components/profile-page";
import AuthPage from "../_components/AuthPage/page";

export default async function Profile() {
  const session = await getServerSession();
  if (session) return <ProfilePage />;
  return <AuthPage />;
}
