'use client';

import { FormEvent, Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Star, Shield, MapPin, Loader2 } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/layout/site-chrome';
import { apiClient } from '@/lib/api/client';

type TeacherCard = {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviews: number;
  price: number;
  distance: string;
  image: string;
  verified: boolean;
  experience: number;
  availability: string[];
};

type SearchResponse = {
  data: TeacherCard[];
  total: number;
  page: number;
  totalPages: number;
};

const fallbackTeachers: TeacherCard[] = [
  {
    id: 'demo-1',
    name: 'Sara Bekele',
    subject: 'Mathematics',
    rating: 4.9,
    reviews: 28,
    price: 450,
    distance: 'Nearby',
    image: '',
    verified: true,
    experience: 6,
    availability: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: 'demo-2',
    name: 'Daniel Hailu',
    subject: 'Physics',
    rating: 4.7,
    reviews: 19,
    price: 500,
    distance: 'Nearby',
    image: '',
    verified: true,
    experience: 4,
    availability: ['Tue', 'Thu'],
  },
  {
    id: 'demo-3',
    name: 'Hanna Tadesse',
    subject: 'English',
    rating: 4.8,
    reviews: 34,
    price: 400,
    distance: 'Nearby',
    image: '',
    verified: true,
    experience: 5,
    availability: ['Sat', 'Sun'],
  },
];

function PublicSearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [subject, setSubject] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<TeacherCard[]>(fallbackTeachers);
  const [usingLiveData, setUsingLiveData] = useState(false);

  async function runSearch(nextSubject?: string) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      const subjectValue = (nextSubject ?? subject ?? query).trim();
      if (subjectValue) params.set('subject', subjectValue);
      params.set('page', '1');
      params.set('limit', '12');

      const result = await apiClient.get<SearchResponse>(`/teachers/search?${params.toString()}`);
      const rows = Array.isArray(result?.data) ? result.data : [];
      setTeachers(rows);
      setUsingLiveData(true);
    } catch {
      setUsingLiveData(false);
      setTeachers(fallbackTeachers);
      setError('Live teacher search is temporarily unavailable. Showing sample profiles.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setQuery(initialQuery);
    setSubject(initialQuery);
    void runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubject(query);
    void runSearch(query);
  }

  const heading = useMemo(() => {
    if (usingLiveData && teachers.length === 0) return 'No teachers matched that search yet';
    return 'Find verified teachers near you';
  }, [usingLiveData, teachers.length]);

  return (
    <>
      <section className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-tutor-green-700">
            Find teachers
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">{heading}</h1>
          <p className="mt-4 text-lg text-gray-600">
            Search by subject to discover local tutors. Create a parent account to book a home
            session, message teachers, and manage lessons.
          </p>
        </motion.div>

        <form
          onSubmit={onSubmit}
          className="mt-8 max-w-3xl rounded-2xl bg-white shadow-xl p-4 border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Subject, e.g. Math, English, Physics…"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-tutor-green-600 text-white font-medium hover:bg-tutor-green-700 transition disabled:opacity-70 inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Search
            </button>
          </div>
        </form>

        {error ? <p className="mt-4 text-sm text-amber-700">{error}</p> : null}
      </section>

      <section className="container mx-auto px-4 mt-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher, index) => (
            <motion.article
              key={teacher.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{teacher.name}</h2>
                  <p className="text-sm text-gray-600">{teacher.subject}</p>
                </div>
                {teacher.verified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-tutor-green-700 bg-tutor-green-50 px-2 py-1 rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {Number(teacher.rating || 0).toFixed(1)} ({teacher.reviews || 0})
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {teacher.distance || 'Local'}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-semibold text-gray-900">
                  {teacher.price ? `${teacher.price} ETB` : 'Rate on request'}
                  <span className="text-sm font-normal text-gray-500"> / hr</span>
                </p>
                <Link
                  href="/register"
                  className="text-sm font-medium text-tutor-green-700 hover:text-tutor-green-800"
                >
                  Book after signup
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-tutor-green-600 text-white p-8 text-center">
          <h2 className="text-2xl font-bold">Ready to book a home lesson?</h2>
          <p className="mt-2 text-white/85">
            Create a free parent account to save favorites, request bookings, and message teachers.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-white text-tutor-green-700 font-semibold hover:bg-gray-50 transition"
            >
              Sign up free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 transition"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function PublicSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tutor-green-50 via-white to-tutor-blue-50">
      <SiteHeader />
      <main className="pt-28 pb-20">
        <Suspense
          fallback={
            <div className="container mx-auto px-4 text-gray-600">Loading teacher search…</div>
          }
        >
          <PublicSearchContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
