import type { ApiError } from '@/types';

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Response) {
    return {
      message: error.statusText || `HTTP ${error.status}`,
      status: error.status,
      statusText: error.statusText,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 0,
      statusText: error.name || 'Error',
    };
  }

  return {
    message: 'An unexpected error occurred',
    status: 0,
    statusText: 'Unknown',
  };
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = handleApiError(error);
  return apiError.message;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes('network') ||
      error.message.toLowerCase().includes('fetch')
    );
  }
  return false;
};
