'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

type VerificationStatus = {
  status: string;
  uploadsConfigured?: boolean;
  latestLog?: {
    id: string;
    status: string;
    verificationType: string;
    documentUrls?: unknown;
    createdAt: string;
    rejectionReason?: string | null;
  } | null;
};

type UploadUrlResponse = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export function VerificationForm() {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [verificationType, setVerificationType] = useState('ID');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function refresh() {
    if (!token) {
      setLoading(false);
      setError('Sign in as a teacher required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<VerificationStatus>(
        ENDPOINTS.teachers.verification,
        token,
      );
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verification status');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!files?.length) {
      setError('Choose at least one document (PDF or image)');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const publicUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type || file.name}`);
        }
        const signed = await apiClient.post<UploadUrlResponse>(
          ENDPOINTS.teachers.verificationUploadUrl,
          { fileName: file.name, contentType: file.type },
          token,
        );
        const put = await fetch(signed.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        if (!put.ok) {
          throw new Error(`S3 upload failed for ${file.name} (${put.status})`);
        }
        publicUrls.push(signed.publicUrl);
      }

      await apiClient.post(
        ENDPOINTS.teachers.verification,
        { documentUrls: publicUrls, verificationType },
        token,
      );
      setSuccess('Submitted for admin review');
      setFiles(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <p className="inline-flex items-center gap-2 text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading verification…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Current status</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          {status?.status?.replace('_', ' ') || 'Unknown'}
        </p>
        {status?.uploadsConfigured === false ? (
          <p className="mt-2 text-sm text-amber-700">
            Document uploads are not configured on the API yet (missing AWS S3 env vars).
          </p>
        ) : null}
        {status?.latestLog ? (
          <p className="mt-2 text-sm text-slate-500">
            Last submission: {new Date(status.latestLog.createdAt).toLocaleString()} ·{' '}
            {status.latestLog.status}
          </p>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <label htmlFor="vtype" className="block text-sm font-medium text-slate-800">
            Document type
          </label>
          <select
            id="vtype"
            value={verificationType}
            onChange={(e) => setVerificationType(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
          >
            <option value="ID">Government ID</option>
            <option value="CREDENTIAL">Teaching credential</option>
            <option value="BACKGROUND">Background check</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="docs" className="block text-sm font-medium text-slate-800">
            ID or credential files
          </label>
          <input
            id="docs"
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-tutor-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-tutor-green-800"
          />
          <p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG, or WebP. Uploaded to S3, then reviewed by admin.</p>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-tutor-green-700">{success}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-tutor-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-tutor-green-700 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitting ? 'Uploading…' : 'Submit for review'}
        </button>
      </form>
    </div>
  );
}
