'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const tokenFromUrl = params.get('token') || '';

  const [email, setEmail] = useState('');
  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [forceReset, setForceReset] = useState(Boolean(tokenFromUrl));
  const mode = forceReset || tokenFromUrl ? 'reset' : 'request';

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await apiClient.post(ENDPOINTS.auth.forgotPassword, { email });
      toast.success('If that email is registered, a reset link was sent');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setBusy(true);
    try {
      await apiClient.post(ENDPOINTS.auth.resetPassword, {
        token,
        newPassword: password,
      });
      toast.success('Password updated. Please sign in.');
      router.push('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <Link href="/" className="mb-6 text-2xl font-bold text-tutor-green-600">
        በቤቴ
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {mode === 'request' ? 'Forgot password' : 'Choose a new password'}
      </h1>
      <p className="mt-2 text-slate-600">
        {mode === 'request'
          ? 'Enter your account email and we will send a reset link.'
          : 'Set a new password for your Tutor Be Betea account.'}
      </p>

      {mode === 'request' ? (
        <form onSubmit={requestReset} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-tutor-green-600 px-4 py-2.5 font-medium text-white hover:bg-tutor-green-700 disabled:opacity-50"
          >
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
          <p className="text-center text-sm text-slate-500">
            Already have a token?{' '}
            <button type="button" className="text-tutor-green-600 hover:underline" onClick={() => setForceReset(true)}>
              Enter it here
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={submitReset} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          {!tokenFromUrl && (
            <label className="block text-sm font-medium text-slate-700">
              Reset token
              <input
                type="text"
                required
                value={token.trim()}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-700">
            New password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Confirm password
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-tutor-green-600 px-4 py-2.5 font-medium text-white hover:bg-tutor-green-700 disabled:opacity-50"
          >
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      )}

      <Link href="/login" className="mt-4 text-center text-sm text-tutor-green-600 hover:underline">
        Back to login
      </Link>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<main className="p-6">Loading…</main>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
