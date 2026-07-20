'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

function VerifyEmailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const required = params.get('required') === '1';

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'idle',
  );
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    required
      ? 'Please verify your email before accessing your dashboard.'
      : 'Confirm your email to continue.',
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        await apiClient.post(ENDPOINTS.auth.verifyEmail, { token });
        if (cancelled) return;
        setStatus('success');
        setMessage('Email verified successfully. You can continue to your dashboard.');
        toast.success('Email verified');

        // Refresh session so middleware sees isVerified=true
        const session = await getSession();
        if (session?.user?.email) {
          // Force token refresh by re-signing is not possible without password;
          // send user to login to pick up verified flag cleanly.
          router.replace('/login?verified=1');
          return;
        }
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  async function resend() {
    if (!email) {
      toast.error('Enter your email');
      return;
    }
    setBusy(true);
    try {
      await apiClient.post(ENDPOINTS.auth.resendVerification, { email });
      toast.success('If that account needs verification, a new email was sent');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not resend');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <Link href="/" className="mb-6 text-2xl font-bold text-tutor-green-600">
        በቤቴ
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Verify email</h1>
      <p className="mt-2 text-slate-600">{message}</p>

      {status === 'verifying' && <p className="mt-6 text-sm text-slate-500">Verifying…</p>}

      {status !== 'verifying' && (
        <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-medium text-slate-700">
            Resend verification email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={resend}
            className="w-full rounded-xl bg-tutor-green-600 px-4 py-2.5 font-medium text-white hover:bg-tutor-green-700 disabled:opacity-50"
          >
            {busy ? 'Sending…' : 'Resend email'}
          </button>
          <Link href="/login" className="block text-center text-sm text-tutor-green-600 hover:underline">
            Back to login
          </Link>
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="p-6">Loading…</main>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
