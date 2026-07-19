export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    resetPassword: '/auth/reset-password',
  },
  users: {
    me: '/users/me',
    update: '/users/me',
  },
  teachers: {
    list: '/teachers',
    byId: (id: string) => `/teachers/${id}`,
    profile: '/teachers/profile',
    availability: '/teachers/availability',
    verification: '/teachers/verification',
  },
  bookings: {
    list: '/bookings',
    create: '/bookings',
    byId: (id: string) => `/bookings/${id}`,
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
  },
  admin: {
    users: '/admin/users',
    disputes: '/admin/disputes',
    verifications: '/admin/verifications',
  },
} as const;
