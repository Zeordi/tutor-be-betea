'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/search', label: 'Find Teachers' },
  { href: '/become-teacher', label: 'Become a Teacher' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-50 w-full glass-effect border-b border-gray-200/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-tutor-green-600">በቤቴ</span>
          <span className="text-sm font-medium text-gray-600">Tutor Be Betea</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${
                  active
                    ? 'font-medium text-tutor-green-700'
                    : 'text-gray-600 hover:text-tutor-green-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
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
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-tutor-green-400 mb-4">በቤቴ</h3>
            <p className="text-gray-400 text-sm">
              Tutor Be Betea — connecting families with verified teachers at home.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Parents</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/search" className="hover:text-white transition">
                  Find Teachers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Teachers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/become-teacher" className="hover:text-white transition">
                  Become a Teacher
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Create Teacher Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Teacher Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} በቤቴ Tutor Be Betea. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
