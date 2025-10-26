export const ERROR_MESSAGES = {
  UNKNOWN: 'ERROR_UNKNOWN',
  NETWORK: 'ERROR_NETWORK',
  SERVER: 'ERROR_SERVER',
} as const;

export type ErrorMessageKey = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
