"use client";

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { Prize } from '@/types';
import { DateTime } from 'luxon';

interface ManagerPanelProps {
  pin: string;
}

/**
 * Manager panel gates access behind a PIN and Supabase magic link authentication. Once
 * authenticated, managers can log Yelp reviews and assign prizes. This component
 * uses client-side supabase-js to interact with the database.
 */
export default function ManagerPanel({ pin }: ManagerPanelProps) {
  const [stage, setStage] = useState<'pin' | 'signin' | 'panel'>('pin');
  const [enteredPin, setEnteredPin] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      setSession(data?.session ?? null);
      if (data?.session) setStage('panel');
    };
    getSession();
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      if (sess) {
        setStage('panel');
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  async function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enteredPin === pin) {
      setStage('signin');
    } else {
      setMessage('Incorrect PIN');
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Sending magic link...');
    const { error } = await supabaseBrowser.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link');
    }
  }

  if (stage === 'pin') {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <h1 className="text-xl font-semibold mb-4">Enter Manager PIN</h1>
        <form onSubmit={handlePinSubmit} className="space-y-3">
          <input
            type="password"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="PIN"
            className="border border-bc-gray/30 rounded-md px-3 py-2 w-full"
          />
          <button
            type="submit"
            className="w-full bg-bc-red text-white py-2 rounded-md hover:bg-bc-blue transition-colors"
          >
            Continue
          </button>
          {message && <p className="text-sm text-red-600">{message}</p>}
        </form>
      </div>
    );
  }

  if (stage === 'signin') {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <form onSubmit={handleSignIn} className="space-y-3">
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

  // Panel: logged in
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Manager Panel</h1>
      <LogReviewForm />
      <ReviewTable />
    </div>
  );
}

/* Placeholder components for the manager panel. These should be replaced with full
 * implementations to log reviews, assign prizes, edit and delete reviews, and
 * export CSV. */
function LogReviewForm() {
  return (
    <div className="bg-white shadow-card rounded-xl2 p-4">
      <h2 className="text-lg font-medium mb-2">Log Yelp Review</h2>
      <p className="text-sm text-bc-gray">
        The full form implementation should go here. It will allow managers to
        select staff, enter date, Yelp link, notes and optionally assign a prize.
      </p>
    </div>
  );
}

function ReviewTable() {
  return (
    <div className="bg-white shadow-card rounded-xl2 p-4">
      <h2 className="text-lg font-medium mb-2">Logged Reviews</h2>
      <p className="text-sm text-bc-gray">
        The review table should list logged reviews with filters and actions.
        Implement fetching from Supabase and actions in a client component.
      </p>
    </div>
  );
}
