// app/(dashboard)/parent/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Star,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Heart,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [stats] = useState({
    upcomingBookings: 3,
    completedLessons: 24,
    favoriteTeachers: 5,
    totalSpent: 450,
  });
  const [upcomingLessons] = useState([
    {
      id: 1,
      teacherName: 'Sarah Johnson',
      subject: 'Mathematics',
      date: '2026-07-15',
      time: '09:00 AM',
      duration: '1 hour',
      status: 'confirmed',
      rating: 4.9,
    },
    {
      id: 2,
      teacherName: 'Michael Chen',
      subject: 'Physics',
      date: '2026-07-16',
      time: '02:30 PM',
      duration: '1.5 hours',
      status: 'pending',
      rating: 4.7,
    },
    {
      id: 3,
      teacherName: 'Emily Rodriguez',
      subject: 'English',
      date: '2026-07-18',
      time: '11:00 AM',
      duration: '1 hour',
      status: 'confirmed',
      rating: 4.8,
    },
  ]);

  const [recentTeachers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      subject: 'Mathematics',
      rating: 4.9,
      reviews: 45,
      price: 45,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      verified: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      subject: 'Physics',
      rating: 4.7,
      reviews: 32,
      price: 50,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      verified: true,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-tutor-green-600 to-tutor-green-700 rounded-2xl p-6 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name || 'Parent'}! 👋</h1>
              <p className="text-white/80">Your child's learning journey continues. Let's find the best teacher!</p>
            </div>
            <Link href="/parent/search">
              <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-tutor-green-700 font-semibold rounded-xl hover:shadow-lg transition flex items-center gap-2">
                <Search className="w-5 h-5" />
                Find New Teachers
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming Lessons</p>
                <p className="text-2xl font-bold mt-1">{stats.upcomingBookings}</p>
              </div>
              <div className="w-10 h-10 bg-tutor-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-tutor-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Lessons</p>
                <p className="text-2xl font-bold mt-1">{stats.completedLessons}</p>
              </div>
              <div className="w-10 h-10 bg-tutor-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-tutor-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Favorite Teachers</p>
                <p className="text-2xl font-bold mt-1">{stats.favoriteTeachers}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold mt-1">${stats.totalSpent}</p>
              </div>
              <div className="w-10 h-10 bg-tutor-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-tutor-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Lessons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Upcoming Lessons</h2>
                <Link href="/parent/bookings" className="text-sm text-tutor-green-600 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-tutor-green-200 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-tutor-green-100 rounded-xl flex items-center justify-center text-tutor-green-600">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{lesson.teacherName}</p>
                        <p className="text-sm text-gray-500">{lesson.subject}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {lesson.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" />
                            {lesson.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        lesson.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{lesson.duration}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/parent/search">
                  <button className="w-full flex items-center justify-between p-3 bg-tutor-green-50 hover:bg-tutor-green-100 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-tutor-green-600" />
                      <span className="font-medium">Find New Teachers</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-tutor-green-600" />
                  </button>
                </Link>
                <Link href="/parent/bookings">
                  <button className="w-full flex items-center justify-between p-3 bg-tutor-blue-50 hover:bg-tutor-blue-100 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-tutor-blue-600" />
                      <span className="font-medium">View My Bookings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-tutor-blue-600" />
                  </button>
                </Link>
                <Link href="/parent/messages">
                  <button className="w-full flex items-center justify-between p-3 bg-tutor-orange-50 hover:bg-tutor-orange-100 rounded-xl transition">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-tutor-orange-600" />
                      <span className="font-medium">Check Messages</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-tutor-orange-600" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Recent Teachers */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Teachers</h2>
              <div className="space-y-3">
                {recentTeachers.map((teacher) => (
                  <Link key={teacher.id} href={`/parent/teacher/${teacher.id}`}>
                    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-tutor-green-200 transition cursor-pointer">
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{teacher.name}</p>
                          {teacher.verified && (
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{teacher.subject}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{teacher.rating}</span>
                          <span className="text-xs text-gray-400">({teacher.reviews})</span>
                        </div>
                        <p className="text-sm font-semibold text-tutor-green-600">${teacher.price}/hr</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
