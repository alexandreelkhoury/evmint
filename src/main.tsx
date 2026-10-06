import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import { initializeWeb3Polyfill } from './utils/web3Polyfill'

initializeWeb3Polyfill()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)

// Report Core Web Vitals to analytics (deferred — never blocks render)
if (typeof window !== 'undefined') {
  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const send = (metric: { name: string; value: number; rating: string }) => {
      import('./utils/analytics').then(({ logEvent }) => {
        logEvent(null, 'web_vitals', {
          metric_name: metric.name,
          metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          metric_rating: metric.rating,
        })
      })
    }
    onCLS(send)
    onINP(send)
    onLCP(send)
    onFCP(send)
    onTTFB(send)
  })
}
