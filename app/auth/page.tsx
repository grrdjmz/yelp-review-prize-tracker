"use client";

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Sending magic link...');
    const { error } = await supabaseBrowser.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the magic link');
  };
  return (
    <div className="max-w-sm mx-auto mt-12 p-4">
      <h1 className="text-xl font-semibold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="border border-bc-gray/30 rounded-md px-3 py-2 w-full"
        />
        <button
          type="submit"
          className="w-full bg-bc-red text-white py-2 rounded-md hover:bg-bc-blue transition-colors"
        >
          Send magic link
        </button>
        {message && <p className="text-sm text-bc-gray">{message}</p>}
      </form>
    </div>
  );
}
