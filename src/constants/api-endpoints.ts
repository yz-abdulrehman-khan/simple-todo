export const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
  TASKS: '/tasks',
  TASK_BY_ID: (id: number) => `/tasks/${id}`,
  COUNTS: '/counts',
} as const;
