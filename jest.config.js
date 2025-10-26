export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@/configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@/constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@/enums/(.*)$': '<rootDir>/src/enums/$1',
    '^@/validations/(.*)$': '<rootDir>/src/validations/$1',
    '^@/transformers/(.*)$': '<rootDir>/src/transformers/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/**/index.ts', // Exclude barrel exports
    '!src/**/index.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 92,
      statements: 92,
    },
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
};
