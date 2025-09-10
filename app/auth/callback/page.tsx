"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically parses tokens from URL
      const { error } = await supabaseBrowser.auth.getSession();
      if (!error) {
        // redirect to manager panel
        router.replace('/manager');
      } else {
        console.error(error);
      }
    };
    handleAuth();
  }, [router]);
  return (
    <div className="p-4">
      <p>Signing you in...</p>
    </div>
  );
}
