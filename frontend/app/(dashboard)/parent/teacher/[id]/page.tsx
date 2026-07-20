'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Award, Clock, Heart, Loader2, MapPin, Star } from 'lucide-react';
import { BookingForm } from '@/components/forms/booking-form';
import { useFavoriteIds, useTeacher } from '@/lib/hooks/use-teachers';

type Props = { params: { id: string } };

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TeacherProfilePage({ params }: Props) {
  const { teacher, loading, error } = useTeacher(params.id);
  const { ids, toggle, isAuthenticated } = useFavoriteIds();
  const [favoriteError, setFavoriteError] = useState('');

  const subjects = useMemo(() => {
    const raw = teacher?.subjects;
    return Array.isArray(raw) ? raw.map(String) : [];
  }, [teacher]);

  const availability = useMemo(() => {
    const rows = Array.isArray(teacher?.availability) ? teacher?.availability : [];
    return (rows as Array<{ dayOfWeek: number; startTime: string; endTime: string }>).map(
      (slot) => ({
        label: dayNames[slot.dayOfWeek] || String(slot.dayOfWeek),
        range: `${slot.startTime}–${slot.endTime}`,
      }),
    );
  }, [teacher]);

  const user = (teacher?.user || {}) as {
    fullName?: string;
    profileImage?: string | null;
  };
  const name = user.fullName || 'Teacher';
  const hourlyRate = Number(teacher?.hourlyRate || 0);
  const rating = Number(teacher?.avgRating || 0);
  const reviews = Number(teacher?.totalReviews || 0);
  const experience = Number(teacher?.experienceYears || 0);
  const verified = teacher?.verificationStatus === 'APPROVED';
  const isFavorite = ids.includes(params.id);

  async function onToggleFavorite() {
    setFavoriteError('');
    try {
      await toggle(params.id);
    } catch (err) {
      setFavoriteError(err instanceof Error ? err.message : 'Could not update favorite');
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading teacher…
        </p>
      </main>
    );
  }

  if (error || !teacher) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Teacher not found</h1>
        <p className="mt-2 text-slate-600">{error || 'This profile is unavailable.'}</p>
        <Link href="/parent/search" className="mt-4 inline-block text-tutor-green-700 font-medium">
          Back to search
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-8">
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-tutor-green-100 to-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-sm overflow-hidden flex items-center justify-center text-3xl font-semibold text-tutor-green-700">
              {user.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.slice(0, 1)
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                    {name}
                  </h1>
                  <p className="mt-1 text-slate-600">
                    {subjects.length ? subjects.join(' · ') : 'General tutoring'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void onToggleFavorite()}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {rating.toFixed(1)} ({reviews} reviews)
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {experience} years experience
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {Number(teacher.serviceRadiusKm || 5)} km radius
                </span>
                {verified ? (
                  <span className="inline-flex items-center gap-1 text-tutor-green-700">
                    <Award className="w-4 h-4" />
                    Verified
                  </span>
                ) : null}
              </div>

              {!isAuthenticated ? (
                <p className="mt-3 text-sm text-slate-500">Sign in as a parent to save favorites.</p>
              ) : null}
              {favoriteError ? <p className="mt-2 text-sm text-amber-700">{favoriteError}</p> : null}
            </div>
            <div className="md:text-right">
              <p className="text-3xl font-bold text-tutor-green-700">${hourlyRate}</p>
              <p className="text-sm text-slate-500">per hour</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">About</h2>
              <p className="mt-2 text-slate-600 whitespace-pre-wrap">
                {(teacher.bio as string) || 'This teacher has not added a bio yet.'}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
              {availability.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {availability.map((slot) => (
                    <li
                      key={`${slot.label}-${slot.range}`}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-slate-700"
                    >
                      {slot.label}: {slot.range}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No recurring availability published yet.</p>
              )}
            </section>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">Request a booking</h2>
              <p className="mt-1 text-sm text-slate-600 mb-4">
                Send a request matched to the teacher’s schedule. Payment happens after they accept.
              </p>
              <BookingForm teacherId={params.id} hourlyRate={hourlyRate} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
