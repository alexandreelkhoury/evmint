import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import { initializeWeb3Polyfill } from './utils/web3Polyfill'

initializeWeb3Polyfill()

// Remove splash screen immediately — React is taking over
const splash = document.getElementById('splash')
if (splash) splash.remove()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
