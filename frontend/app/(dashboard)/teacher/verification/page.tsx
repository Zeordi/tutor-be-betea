'use client';

import { VerificationForm } from '@/components/forms/verification-form';

export default function TeacherVerificationPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Verification</h1>
        <p className="mt-2 text-slate-600">
          Upload ID and credential documents. Admins review submissions manually (Veriff can come
          later).
        </p>
      </div>
      <VerificationForm />
    </main>
  );
}
