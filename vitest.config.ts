import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'tests/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/schemas': resolve(__dirname, 'schemas'),
      '@/stories': resolve(__dirname, 'stories')
    }
  }
})