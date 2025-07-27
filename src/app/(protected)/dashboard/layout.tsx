import AuthPage from '@/components/authen-page';
import { authOptions } from '@/modules/authentication/authConfig';
import { getServerSession } from "next-auth/next";
import React from 'react';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getServerSession(authOptions);
  console.log(data);
  
  return (data) ? (
    <React.Fragment>
      {children}
    </React.Fragment>
  ):(
    <AuthPage></AuthPage>
  );
}