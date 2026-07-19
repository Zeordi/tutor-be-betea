// app/(landing)/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  Shield,
  Star,
  MapPin,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full glass-effect border-b border-gray-200/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-tutor-green-600">በቤቴ</span>
            <span className="text-sm font-medium text-gray-600">Tutor Be Betea</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-gray-600 hover:text-tutor-green-600 transition">
              Find Teachers
            </Link>
            <Link href="/become-teacher" className="text-gray-600 hover:text-tutor-green-600 transition">
              Become a Teacher
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-tutor-green-600 transition">
              About
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 text-sm font-medium text-white bg-tutor-green-600 hover:bg-tutor-green-700 rounded-lg transition shadow-md hover:shadow-lg">
                Sign Up Free
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-tutor-green-50 via-white to-tutor-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-tutor-green-100 text-tutor-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Trusted by 10,000+ families
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find the Perfect{' '}
                <span className="text-gradient">Teacher</span>
                <br />
                for Your Child's Future
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Connect with verified, local teachers who come to your home.
                Trusted by parents across Ethiopia.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl shadow-xl p-4 max-w-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Subject, teacher name..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500 transition"
                    />
                  </div>
                  <button className="px-6 py-3 bg-tutor-green-600 text-white rounded-xl hover:bg-tutor-green-700 transition font-medium whitespace-nowrap">
                    Find Teachers
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">500+ teachers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-gray-500">(2,500+ reviews)</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-tutoring.jpg"
                  alt="Tutoring session"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <p className="text-lg font-semibold">"Amazing teacher! My daughter improved so much."</p>
                    <p className="text-sm opacity-80">— Sarah M., Parent</p>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-pulse-soft">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-tutor-green-600" />
                  <span className="text-sm font-semibold">100% Verified</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-tutor-orange-500" />
                  <span className="text-sm font-semibold">Book in 2 min</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Thousands of Families Choose <span className="text-tutor-green-600">በቤቴ</span>
            </h2>
            <p className="text-gray-600">
              We connect parents with the best verified teachers who provide quality education at home.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-gray-50 rounded-2xl hover:shadow-card transition-all card-hover"
              >
                <div className="w-12 h-12 bg-tutor-green-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-tutor-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-tutor-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-tutor-green-600">በቤቴ</span> Works
            </h2>
            <p className="text-gray-600">
              Three simple steps to find the perfect teacher for your child.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 bg-tutor-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-tutor-green-200 -z-0" />
                )}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 max-w-xs mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Families Say
            </h2>
            <p className="text-gray-600">
              Real stories from parents who found amazing teachers on በቤቴ.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 card-hover"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-tutor-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find the Perfect Teacher?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust በቤቴ for their children's education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <button className="px-8 py-4 bg-white text-tutor-green-700 font-semibold rounded-xl hover:shadow-xl transition transform hover:-translate-y-0.5">
                Get Started Free
              </button>
            </Link>
            <Link href="/search">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">
                Find Teachers
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-tutor-green-400 mb-4">በቤቴ</h3>
              <p className="text-gray-400 text-sm">Tutor Be Betea - Connecting families with verified teachers at home.</p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition">📱</a>
                <a href="#" className="text-gray-400 hover:text-white transition">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition">📺</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Parents</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Find Teachers</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Safety</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Teachers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Become a Teacher</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Earnings</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            &copy; 2026 በቤቴ Tutor Be Betea. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: 'Verified Teachers',
    description: 'Every teacher is verified with official ID and teaching certificates.',
  },
  {
    icon: MapPin,
    title: 'Local & Trusted',
    description: 'Find teachers in your neighborhood who come to your home.',
  },
  {
    icon: Star,
    title: 'Quality Guaranteed',
    description: 'Real reviews from parents help you make the right choice.',
  },
];

const steps = [
  {
    title: 'Search & Discover',
    description: 'Find qualified teachers in your area based on subject, rating, and availability.',
  },
  {
    title: 'Book & Pay',
    description: 'Securely book lessons and pay through our protected escrow system.',
  },
  {
    title: 'Learn & Grow',
    description: 'Your child learns from the best teacher in the comfort of your home.',
  },
];

const testimonials = [
  {
    name: 'Emily T.',
    role: 'Parent of 2',
    quote: 'በቤቴ made it so easy to find a math tutor for my son. He went from struggling to top of his class in 3 months!',
  },
  {
    name: 'Michael K.',
    role: 'Parent',
    quote: 'I love that all teachers are verified. It gives me peace of mind knowing my children are safe.',
  },
  {
    name: 'Hanna W.',
    role: 'Parent of 3',
    quote: 'The best tutoring platform in Ethiopia. The teachers are professional, friendly, and my kids love them.',
  },
];
