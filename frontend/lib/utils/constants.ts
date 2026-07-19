export const APP_NAME = 'BeTea';
export const DEFAULT_PAGE_SIZE = 20;
export const ROLES = ['PARENT', 'TEACHER', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];
