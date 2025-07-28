import Header from '@/components/header';
import React from 'react';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-grow'>
        {children}
      </div>
    </div>
  );
}