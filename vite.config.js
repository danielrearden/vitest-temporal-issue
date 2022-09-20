import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      './test/runWithWorkflowClient.ts',
    ],
    globals: true,
    include: [
      './test/*.ts',
    ],
    testTimeout: 60_000,
    threads: process.env.THREADS !== 'false',
  },
});
