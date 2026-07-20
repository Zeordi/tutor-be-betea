'use client';

import Link from 'next/link';
import { Heart, Loader2, Star } from 'lucide-react';
import { useFavorites } from '@/lib/hooks/use-favorites';

export default function FavoritesPage() {
  const { favorites, loading, error, remove } = useFavorites();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Favorites</h1>
      <p className="mt-2 text-slate-600">Teachers you saved for later</p>

      {loading ? (
        <p className="mt-8 inline-flex items-center gap-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading favorites…
        </p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {!loading && !error && favorites.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-slate-600">
          No favorites yet.{' '}
          <Link href="/parent/search" className="text-tutor-green-700 font-medium">
            Browse teachers
          </Link>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {favorites.map((fav) => (
          <article
            key={fav.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{fav.teacher.name}</h2>
                <p className="text-sm text-slate-600">{fav.teacher.subject}</p>
              </div>
              <button
                type="button"
                onClick={() => void remove(fav.teacherId)}
                className="rounded-full border border-gray-200 p-2 hover:bg-gray-50"
                aria-label="Remove favorite"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {Number(fav.teacher.rating || 0).toFixed(1)}
              </span>
              <span>${fav.teacher.price}/hr</span>
            </div>
            <Link
              href={`/parent/teacher/${fav.teacherId}`}
              className="mt-4 inline-flex rounded-lg bg-tutor-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-tutor-green-700"
            >
              View profile
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
