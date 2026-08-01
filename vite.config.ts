import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@base-org/account'],
    // Don't pre-bundle Web3 libraries - let them be lazily loaded
    include: ['framer-motion']
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
        /**
         * Smart chunk splitting for lazy Web3 loading
         *
         * Strategy: Use a function-based manualChunks to ensure Web3 libraries
         * are only bundled together and not pulled into the main bundle.
         */
        manualChunks(id) {
          // Web3 core libraries - should be lazily loaded
          if (
            id.includes('node_modules/wagmi') ||
            id.includes('node_modules/viem') ||
            id.includes('node_modules/@privy-io') ||
            id.includes('node_modules/@tanstack/react-query') ||
            id.includes('node_modules/@wagmi') ||
            id.includes('node_modules/@walletconnect') ||
            id.includes('node_modules/@reown') ||
            id.includes('node_modules/@web3modal') ||
            id.includes('node_modules/@safe-global')
          ) {
            return 'vendor-web3'
          }

          // React core - loaded immediately
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom') ||
            id.includes('node_modules/react-helmet-async')
          ) {
            return 'vendor-react'
          }

          // UI libraries
          if (
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/@heroicons') ||
            id.includes('node_modules/@web3icons')
          ) {
            return 'vendor-ui'
          }

          // Firebase
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase'
          }

          // Utilities
          if (
            id.includes('node_modules/zod') ||
            id.includes('node_modules/dompurify') ||
            id.includes('node_modules/validator')
          ) {
            return 'vendor-utils'
          }
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
