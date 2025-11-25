import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@base-org/account'],
    include: ['@privy-io/react-auth', '@privy-io/wagmi', '@tanstack/react-query', 'framer-motion']
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
    },
  },
  build: {
    rollupOptions: {
      external: ['@safe-globalThis/safe-apps-sdk', '@safe-globalThis/safe-apps-provider'],
      plugins: [],
      output: {
        manualChunks: {
          // Core React libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],

          // Web3 and wallet libraries (largest bundle)
          'vendor-web3': [
            'wagmi',
            'viem',
            '@privy-io/react-auth',
            '@privy-io/wagmi',
            '@tanstack/react-query',
            'ethers'
          ],

          // UI and animation libraries
          'vendor-ui': [
            'framer-motion',
            '@heroicons/react',
            '@web3icons/react'
          ],

          // Firebase Analytics
          'vendor-firebase': [
            'firebase/app',
            'firebase/analytics'
          ],

          // Utilities and validation
          'vendor-utils': [
            'zod',
            'dompurify',
            'validator'
          ]
        }
      },
      onwarn(warning, warn) {
        // Ignore Safe wallet related warnings
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.id?.includes('@safe-global')) {
          return
        }
        warn(warning)
      }
    },
    // Increase chunk size warning limit for web3 libraries
    chunkSizeWarningLimit: 600,
    // Disable source maps for smaller bundle
    sourcemap: false,
    // Use esbuild for minification (faster than terser, included with Vite)
    minify: 'esbuild',
    target: 'es2020'
  }
})
