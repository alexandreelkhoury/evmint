/**
 * NetworkManagerLazy
 *
 * Lazy wrapper for NetworkManager that only loads when Web3 is available.
 * This prevents Web3 imports from being bundled in the initial load.
 */

import { lazy, Suspense } from 'react'
import { useWeb3Load } from './LazyWeb3Provider'

// Lazy load the actual NetworkManager
const NetworkManagerFull = lazy(() => import('./NetworkManager'))

export default function NetworkManagerLazy() {
  const { isWeb3Loaded } = useWeb3Load()

  // Only render NetworkManager when Web3 is loaded
  // NetworkManager only does anything when the user is connected anyway
  if (!isWeb3Loaded) {
    return null
  }

  return (
    <Suspense fallback={null}>
      <NetworkManagerFull />
    </Suspense>
  )
}
