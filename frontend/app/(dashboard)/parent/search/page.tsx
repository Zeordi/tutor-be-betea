// app/(dashboard)/parent/search/page.tsx
'use client';

import { useState } from 'react';
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
  MessageCircle,
} from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface Teacher {
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
  badges: string[];
  isFavorite?: boolean;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: '',
    priceRange: [0, 100],
    rating: 0,
    availability: '',
    radius: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      subject: 'Mathematics',
      rating: 4.9,
      reviews: 45,
      price: 45,
      distance: '2.3 km',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      verified: true,
      experience: 6,
      availability: ['Mon', 'Wed', 'Fri'],
      badges: ['Top Rated', 'Best Match'],
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Michael Chen',
      subject: 'Physics',
      rating: 4.7,
      reviews: 32,
      price: 50,
      distance: '4.1 km',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      verified: true,
      experience: 4,
      availability: ['Tue', 'Thu', 'Sat'],
      badges: ['Verified'],
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      subject: 'English',
      rating: 4.8,
      reviews: 38,
      price: 40,
      distance: '1.8 km',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
      verified: true,
      experience: 5,
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      badges: ['Top Rated', 'Popular'],
      isFavorite: false,
    },
    {
      id: '4',
      name: 'David Kim',
      subject: 'Chemistry',
      rating: 4.6,
      reviews: 28,
      price: 55,
      distance: '3.5 km',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      verified: true,
      experience: 3,
      availability: ['Wed', 'Fri', 'Sat'],
      badges: ['Verified'],
      isFavorite: false,
    },
    {
      id: '5',
      name: 'Amanda Lee',
      subject: 'Biology',
      rating: 4.9,
      reviews: 52,
      price: 48,
      distance: '5.2 km',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      verified: true,
      experience: 7,
      availability: ['Mon', 'Tue', 'Thu'],
      badges: ['Top Rated', 'Best Match', 'Popular'],
      isFavorite: false,
    },
  ]);

  useDebounce(searchQuery, 300);

  const toggleFavorite = (id: string) => {
    setTeachers(teachers.map(t =>
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      priceRange: [0, 100],
      rating: 0,
      availability: '',
      radius: 10,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Find Teachers Near You</h1>
          <p className="text-gray-600">Discover verified teachers in your area</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by subject, teacher name, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500 transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Sliders className="w-5 h-5" />
                <span>Filters</span>
              </button>
              <button className="px-6 py-3 bg-tutor-green-600 text-white rounded-xl hover:bg-tutor-green-700 transition font-medium whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
                Clear All
              </button>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                >
                  <option value="">All Subjects</option>
                  <option value="math">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    className="w-full"
                  />
                  <span className="text-sm font-medium">${filters.priceRange[1]}+</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFilters({ ...filters, rating: star })}
                      className="text-2xl"
                    >
                      <Star className={`w-6 h-6 ${
                        star <= filters.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`} />
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
                  onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tutor-green-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold">{teachers.length}</span> teachers
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tutor-green-500 text-sm">
              <option>Relevance</option>
              <option>Rating</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Distance</option>
            </select>
          </div>
        </div>

        {/* Teacher Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-card transition-all card-hover"
            >
              <div className="relative">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleFavorite(teacher.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
                >
                  {teacher.isFavorite ? (
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {teacher.verified && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Verified
                  </div>
                )}
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
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {teacher.rating} ({teacher.reviews} reviews)
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
                  {teacher.availability.map((day) => (
                    <span key={day} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {day}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link href={`/parent/teacher/${teacher.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-tutor-green-600 text-white text-sm font-medium rounded-lg hover:bg-tutor-green-700 transition">
                      View Profile
                    </button>
                  </Link>
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition">
            Load More Teachers
          </button>
        </div>
      </div>
    </div>
  );
}
