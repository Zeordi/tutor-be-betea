'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Shield, MessageCircle, CreditCard, Star, Users } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/layout/site-chrome';

const offers = [
  {
    icon: Shield,
    title: 'Verified local teachers',
    body: 'Every teacher goes through ID and credential checks before they appear in search.',
  },
  {
    icon: Home,
    title: 'Lessons at your home',
    body: 'Book sessions that happen where your child is most comfortable — በቤቴ means “At My Home”.',
  },
  {
    icon: MessageCircle,
    title: 'In-app messaging',
    body: 'Coordinate schedules, share goals, and stay aligned with your teacher around each booking.',
  },
  {
    icon: CreditCard,
    title: 'Secure payments',
    body: 'Pay for confirmed sessions through Stripe-backed checkout with clear booking status.',
  },
  {
    icon: Star,
    title: 'Reviews you can trust',
    body: 'Parents leave ratings after completed lessons so families can choose with confidence.',
  },
  {
    icon: Users,
    title: 'Built for Ethiopian families',
    body: 'Designed for parents and teachers who want reliable, neighborhood-based tutoring.',
  },
];

const steps = [
  'Create a parent account and tell us what your child needs.',
  'Search verified teachers by subject, rate, and availability.',
  'Book a home session, confirm details, and pay securely.',
  'Learn, message, and leave a review when the lesson is done.',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tutor-green-50 via-white to-tutor-blue-50">
      <SiteHeader />

      <main className="pt-28 pb-20">
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-tutor-green-700">
              About Tutor Be Betea
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Home tutoring that brings trusted teachers to your door
            </h1>
            <p className="mt-5 text-lg text-gray-600">
              Tutor Be Betea (በቤቴ) is a marketplace that connects parents with verified local
              teachers for home-based lessons. We help families find the right tutor, book with
              confidence, and keep learning close to home.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">What the platform provides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl bg-white/80 border border-gray-100 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-tutor-green-100 text-tutor-green-700 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 mt-16">
          <div className="rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">How it works</h2>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-4 text-gray-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tutor-green-600 text-white text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="px-5 py-3 rounded-xl bg-tutor-green-600 text-white font-medium hover:bg-tutor-green-700 transition"
              >
                Find teachers
              </Link>
              <Link
                href="/become-teacher"
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Teach with us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
