"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (session && pathname === '/admin/login') {
        router.push('/admin/dashboard');
      }
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    let subscription: any = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        if (!session && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      });
      subscription = data.subscription;
    }

    return () => subscription?.unsubscribe();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rl-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rl-space-blue"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-rl-black text-rl-white">
      {/* Main site navbar - shown except on login page, with admin buttons instead of lower nav */}
      {pathname !== '/admin/login' && <Navbar hideSectionButtons={true} hideCareerButton={true} adminButtons={true} />}
      
      <main className={`w-full ${pathname !== '/admin/login' ? 'p-4 md:p-8 pt-32 pb-48' : ''} max-w-7xl mx-auto`}>
        {children}
      </main>
      
      {/* Footer - shown except on login page */}
      {pathname !== '/admin/login' && <Footer />}
    </div>
  );
}
