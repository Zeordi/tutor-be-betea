'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, CalendarDays, Banknote, GraduationCap, ArrowRight } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/layout/site-chrome';

const benefits = [
  {
    icon: GraduationCap,
    title: 'Reach families near you',
    body: 'Parents search for verified teachers by subject and location. Your profile helps the right households find you.',
  },
  {
    icon: BadgeCheck,
    title: 'Build trust with verification',
    body: 'Submit ID and teaching credentials. Once approved, your profile can appear in public teacher search.',
  },
  {
    icon: CalendarDays,
    title: 'Control your availability',
    body: 'Set weekly teaching windows, accept booking requests, and keep your calendar under your control.',
  },
  {
    icon: Banknote,
    title: 'Earn from confirmed lessons',
    body: 'Confirmed sessions move through secure payment flows so you can focus on teaching, not chasing invoices.',
  },
];

const steps = [
  { title: 'Create a teacher account', body: 'Register as a teacher and complete your profile basics.' },
  { title: 'Add subjects & rates', body: 'Share what you teach, your experience, and your hourly rate.' },
  { title: 'Verify your identity', body: 'Upload documents so parents know you are a trusted local tutor.' },
  { title: 'Set availability & go live', body: 'Open your schedule, accept bookings, and start teaching at home.' },
];

export default function BecomeTeacherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-tutor-blue-50 via-white to-tutor-green-50">
      <SiteHeader />

      <main className="pt-28 pb-20">
        <section className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-semibold uppercase tracking-wider text-tutor-blue-700">
                For teachers
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Teach families in your community with በቤቴ
              </h1>
              <p className="mt-5 text-lg text-gray-600 max-w-xl">
                Tutor Be Betea helps verified teachers find local students, manage bookings, and get
                paid for home tutoring sessions — without building a marketplace from scratch.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tutor-green-600 text-white font-semibold hover:bg-tutor-green-700 transition"
                >
                  Start as a teacher
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-white transition"
                >
                  Already teaching? Log in
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-gradient-to-br from-tutor-green-600 to-tutor-blue-600 p-8 text-white shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4">What you get</h2>
              <ul className="space-y-3 text-white/90">
                <li>• A public profile parents can discover</li>
                <li>• Verification workflow to stand out as trusted</li>
                <li>• Availability tools for weekly teaching slots</li>
                <li>• Booking and messaging around each lesson</li>
                <li>• Payment support for confirmed sessions</li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Why teachers join</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-tutor-blue-100 text-tutor-blue-700 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 mt-16">
          <div className="rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Path to your first booking</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tutor-green-600 text-white text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tutor-green-600 text-white font-semibold hover:bg-tutor-green-700 transition"
              >
                Create teacher account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
