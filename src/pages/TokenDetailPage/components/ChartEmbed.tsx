import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ChartEmbedProps {
  embedUrl: string | null
  loading: boolean
}

export default function ChartEmbed({ embedUrl, loading }: ChartEmbedProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  if (loading) {
    return (
      <div className="w-full aspect-[16/9] min-h-[400px] rounded-2xl bg-white/5 border border-white/10 animate-pulse flex flex-col items-center justify-center gap-3">
        {/* Issue #13: More contextual loading skeleton */}
        <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <div className="text-gray-400 font-sans text-sm">Loading chart...</div>
        {/* Fake chart lines skeleton */}
        <div className="w-3/4 h-px bg-white/5 mt-2" />
        <div className="w-2/3 h-px bg-white/5" />
        <div className="w-4/5 h-px bg-white/5" />
      </div>
    )
  }

  if (!embedUrl) {
    return (
      <div className="w-full aspect-[16/9] min-h-[400px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <div className="text-center text-gray-500 font-sans">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p>Chart unavailable for this network</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full aspect-[16/9] min-h-[400px] rounded-2xl overflow-hidden border border-white/10 relative"
    >
      {/* Loading overlay */}
      {!iframeLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center z-10">
          <div className="text-gray-500 font-sans text-sm">Loading chart...</div>
        </div>
      )}

      <iframe
        src={embedUrl}
        title="Token Price Chart"
        className="w-full h-full absolute inset-0 border-0"
        style={{ colorScheme: 'dark' }}
        loading="lazy"
        onLoad={() => setIframeLoaded(true)}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </motion.div>
  )
}
