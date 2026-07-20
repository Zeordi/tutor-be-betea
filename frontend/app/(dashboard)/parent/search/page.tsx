'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Sliders,
  MapPin,
  Star,
  Clock,
  Award,
  Heart,
  Loader2,
} from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useFavoriteIds, useTeacherSearch } from '@/lib/hooks/use-teachers';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSubject, setAppliedSubject] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    priceRange: [0, 100] as [number, number],
    rating: 0,
    radius: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [favoriteError, setFavoriteError] = useState('');

  const debouncedQuery = useDebounce(searchQuery, 350);
  const subject = useMemo(
    () => (filters.subject || appliedSubject || debouncedQuery).trim(),
    [filters.subject, appliedSubject, debouncedQuery],
  );

  const { data, total, totalPages, loading, error, refresh } = useTeacherSearch({
    subject: subject || undefined,
    maxPrice: filters.priceRange[1] || undefined,
    rating: filters.rating || undefined,
    radius: filters.radius,
    page,
    limit: 12,
  });

  const { ids: favoriteIds, toggle, isAuthenticated } = useFavoriteIds();

  const clearFilters = () => {
    setFilters({
      subject: '',
      priceRange: [0, 100],
      rating: 0,
      radius: 10,
    });
    setAppliedSubject('');
    setSearchQuery('');
    setPage(1);
  };

  async function onToggleFavorite(teacherId: string) {
    setFavoriteError('');
    try {
      await toggle(teacherId);
    } catch (err) {
      setFavoriteError(err instanceof Error ? err.message : 'Could not update favorite');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Find Teachers Near You</h1>
          <p className="text-gray-600">Discover verified teachers from live listings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by subject, teacher name, or skill..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500 transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Sliders className="w-5 h-5" />
                <span>Filters</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAppliedSubject(searchQuery);
                  setPage(1);
                  void refresh();
                }}
                className="px-6 py-3 bg-tutor-green-600 text-white rounded-xl hover:bg-tutor-green-700 transition font-medium whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button type="button" onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
                Clear All
              </button>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
                  value={filters.subject}
                  onChange={(e) => {
                    setFilters({ ...filters, subject: e.target.value });
                    setPage(1);
                  }}
                >
                  <option value="">All Subjects</option>
                  <option value="Math">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max price</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      setFilters({ ...filters, priceRange: [0, parseInt(e.target.value, 10)] });
                      setPage(1);
                    }}
                    className="w-full"
                  />
                  <span className="text-sm font-medium">${filters.priceRange[1]}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setFilters({ ...filters, rating: star });
                        setPage(1);
                      }}
                      className="text-2xl"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= filters.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Radius (km)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={filters.radius}
                  onChange={(e) => {
                    setFilters({ ...filters, radius: parseInt(e.target.value, 10) || 10 });
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold">{total}</span> teachers
          </p>
          {loading ? (
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </span>
          ) : null}
        </div>

        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        {favoriteError ? <p className="mb-4 text-sm text-amber-700">{favoriteError}</p> : null}
        {!isAuthenticated ? (
          <p className="mb-4 text-sm text-gray-500">Sign in as a parent to save favorites.</p>
        ) : null}

        {!loading && data.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-600 shadow-sm">
            No verified teachers matched that search yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((teacher, index) => {
              const isFavorite = favoriteIds.includes(teacher.id);
              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-card transition-all"
                >
                  <div className="relative">
                    <div className="w-full h-40 bg-gradient-to-br from-tutor-green-100 to-tutor-green-50 flex items-center justify-center">
                      {teacher.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={teacher.image}
                          alt={teacher.name}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-semibold text-tutor-green-700">
                          {(teacher.name || '?').slice(0, 1)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void onToggleFavorite(teacher.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
                      aria-label={isFavorite ? 'Remove favorite' : 'Save favorite'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                    {teacher.verified ? (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Verified
                      </div>
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{teacher.name}</h3>
                        <p className="text-gray-600 text-sm">{teacher.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-tutor-green-600">${teacher.price}</p>
                        <p className="text-xs text-gray-500">per hour</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {Number(teacher.rating || 0).toFixed(1)} ({teacher.reviews || 0})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {teacher.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {teacher.experience} years
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(teacher.availability || []).slice(0, 5).map((day) => (
                        <span key={day} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                    <Link href={`/parent/teacher/${teacher.id}`} className="block">
                      <button
                        type="button"
                        className="w-full px-4 py-2 bg-tutor-green-600 text-white text-sm font-medium rounded-lg hover:bg-tutor-green-700 transition"
                      >
                        View Profile
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
