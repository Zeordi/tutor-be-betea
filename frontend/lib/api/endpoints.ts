export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  users: {
    me: '/users/me',
    update: '/users/me',
  },
  teachers: {
    list: '/teachers',
    search: '/teachers/search',
    byId: (id: string) => `/teachers/${id}`,
    availability: '/teachers/availability',
    verification: '/teachers/verification',
  },
  bookings: {
    list: '/bookings',
    create: '/bookings',
    byId: (id: string) => `/bookings/${id}`,
    confirm: (id: string) => `/bookings/${id}/confirm`,
    complete: (id: string) => `/bookings/${id}/complete`,
    cancel: (id: string) => `/bookings/${id}/cancel`,
  },
  favorites: {
    list: '/favorites',
    ids: '/favorites/ids',
    create: '/favorites',
    remove: (teacherId: string) => `/favorites/${teacherId}`,
  },
  payments: {
    create: '/payments',
    refund: '/payments/refund',
  },
  chat: {
    conversations: '/chat/conversations',
  },
  reviews: {
    create: '/reviews',
    byTeacher: (teacherId: string) => `/reviews/teacher/${teacherId}`,
  },
  admin: {
    users: '/admin/users',
    disputes: '/admin/disputes',
    verifications: '/admin/verifications',
  },
} as const;
