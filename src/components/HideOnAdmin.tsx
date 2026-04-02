"use client";

import { usePathname } from 'next/navigation';

export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on admin pages and team login page
  if (pathname?.startsWith('/admin') || pathname === '/team/login') {
    return null;
  }
  
  return <>{children}</>;
}
