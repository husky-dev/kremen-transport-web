import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node', // jsdom or node
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(txt|md|tsv)$': '<rootDir>/tools/textTransformer.js',
  },
  // setupFiles: ['<rootDir>/src/tests/setupTests.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'json-summary', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!src/**/*.d.ts',
    '!src/**/story.{ts,tsx}',
    '!src/index.tsx',
    '!src/serviceWorker.ts',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
  ],
  coveragePathIgnorePatterns: ['./src/*/types.{ts,tsx}', './src/index.tsx', './src/serviceWorker.ts', './src/setupTests.ts'],
  // setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};

export default jestConfig;
