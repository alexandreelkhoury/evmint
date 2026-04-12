import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ChainIcon from '../../../components/ChainIcon'
import { MAINNET_CHAINS } from '../../../config/chains'

const ORBIT_CHAINS = MAINNET_CHAINS.slice(0, 12)

// ─── Subtle background effects that blend with the page bg-gray-900 ─────────
function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Soft radial glow — fades to transparent, no hard edges */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.04)_0%,_transparent_60%)] hidden lg:block" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.03)_0%,_transparent_55%)]" />
    </div>
  )
}

// ─── Shared chain icon node with hover tooltip ───────────────────────────────
function ChainNode({
  chain,
  cx,
  cy,
  size,
  iconSize,
  delay,
  floatDuration,
  floatDelay,
}: {
  chain: typeof ORBIT_CHAINS[0]
  cx: number
  cy: number
  size: number
  iconSize: number
  delay: number
  floatDuration: number
  floatDelay: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="absolute"
      style={{ left: cx - size / 2, top: cy - size / 2 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ y: [0, -5, 0, 4, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
      >
        {/* Hover glow */}
        <motion.div
          className="absolute rounded-full bg-amber-400/10 blur-xl"
          style={{ inset: -size * 0.4 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          className="relative rounded-full flex items-center justify-center backdrop-blur-sm cursor-default"
          style={{ width: size, height: size, border: '1px solid rgba(255,255,255,0.08)' }}
          animate={{
            backgroundColor: isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
            borderColor: isHovered ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)',
            scale: isHovered ? 1.18 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <ChainIcon chainId={chain.id} size={iconSize} />
        </motion.div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
              style={{ top: size + 8 }}
            >
              <span className="px-2.5 py-1 rounded-md bg-gray-800/90 border border-white/10 text-xs font-medium text-gray-200 shadow-xl">
                {chain.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Chain constellation ─────────────────────────────────────────────────────
function ChainConstellation() {
  const outerChains = ORBIT_CHAINS.slice(0, 8)
  const innerChains = ORBIT_CHAINS.slice(8, 12)

  const CX = 240
  const CY = 240
  const outerR = 185
  const innerR = 105

  const outerPos = outerChains.map((_, i) => {
    const a = (i / outerChains.length) * Math.PI * 2 - Math.PI / 2
    return { x: CX + Math.cos(a) * outerR, y: CY + Math.sin(a) * outerR }
  })
  const innerPos = innerChains.map((_, i) => {
    const a = (i / innerChains.length) * Math.PI * 2 - Math.PI / 3
    return { x: CX + Math.cos(a) * innerR, y: CY + Math.sin(a) * innerR }
  })

  return (
    <div className="relative w-[480px] h-[480px] mx-auto hidden lg:block">
      {/* Slow rotation on the whole constellation */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {/* Orbit rings */}
        <motion.div
          className="absolute rounded-full border border-white/[0.04]"
          style={{ width: outerR * 2, height: outerR * 2, left: CX - outerR, top: CY - outerR }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute rounded-full border border-dashed border-white/[0.03]"
          style={{ width: innerR * 2, height: innerR * 2, left: CX - innerR, top: CY - innerR }}
        />
      </motion.div>

      {/* Ambient center pulse — no logo, just energy */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80, height: 80, left: CX - 40, top: CY - 40,
          background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.03) 50%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8, height: 8, left: CX - 4, top: CY - 4,
          background: 'rgba(251,191,36,0.5)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(251,191,36,0.3)',
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Network lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 480" fill="none">
        <defs>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(251,191,36,0.14)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.02)" />
          </linearGradient>
        </defs>

        {/* Center to outer */}
        {outerPos.map((p, i) => (
          <motion.line key={`co${i}`} x1={CX} y1={CY} x2={p.x} y2={p.y}
            stroke="url(#lg)" strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.06 }}
          />
        ))}

        {/* Center to inner */}
        {innerPos.map((p, i) => (
          <motion.line key={`ci${i}`} x1={CX} y1={CY} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 0.8, delay: 0.9 + i * 0.07 }}
          />
        ))}

        {/* Outer polygon */}
        {outerPos.map((p, i) => {
          const next = outerPos[(i + 1) % outerPos.length]
          return (
            <motion.line key={`oo${i}`} x1={p.x} y1={p.y} x2={next.x} y2={next.y}
              stroke="rgba(255,255,255,0.035)" strokeWidth="1"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.04 }}
            />
          )
        })}

        {/* Inner to outer cross-links (dashed) */}
        {innerPos.map((ip, i) => {
          const o1 = outerPos[i * 2] || outerPos[0]
          const o2 = outerPos[i * 2 + 1] || outerPos[1]
          return (
            <g key={`x${i}`}>
              <motion.line x1={ip.x} y1={ip.y} x2={o1.x} y2={o1.y}
                stroke="rgba(251,191,36,0.05)" strokeWidth="1" strokeDasharray="3 5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 + i * 0.1 }}
              />
              <motion.line x1={ip.x} y1={ip.y} x2={o2.x} y2={o2.y}
                stroke="rgba(251,191,36,0.04)" strokeWidth="1" strokeDasharray="3 5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
              />
            </g>
          )
        })}

        {/* Data pulses traveling along lines */}
        {[0, 3, 6].map((idx) => {
          const p = outerPos[idx]
          return (
            <motion.circle key={`dp${idx}`} r="1.5" fill="rgba(251,191,36,0.5)"
              animate={{ cx: [CX, p.x, CX], cy: [CY, p.y, CY], opacity: [0.8, 0.4, 0.8] }}
              transition={{ duration: 4 + idx * 0.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 1.5 }}
            />
          )
        })}
      </svg>

      {/* Outer ring icons */}
      {outerChains.map((chain, i) => (
        <ChainNode key={chain.id} chain={chain}
          cx={outerPos[i].x} cy={outerPos[i].y}
          size={46} iconSize={26}
          delay={0.4 + i * 0.06}
          floatDuration={5 + i * 0.5} floatDelay={i * 0.25}
        />
      ))}

      {/* Inner ring icons */}
      {innerChains.map((chain, i) => (
        <ChainNode key={chain.id} chain={chain}
          cx={innerPos[i].x} cy={innerPos[i].y}
          size={40} iconSize={22}
          delay={0.9 + i * 0.07}
          floatDuration={6 + i * 0.7} floatDelay={i * 0.4}
        />
      ))}
    </div>
  )
}

// ─── Rotating chain name ─────────────────────────────────────────────────────
function ChainRotator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % MAINNET_CHAINS.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  const chain = MAINNET_CHAINS[index]

  return (
    <span className="inline-block relative min-w-[160px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={chain.id}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
        >
          {chain.name}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// ─── Scrolling chain strip ───────────────────────────────────────────────────
function ChainStrip() {
  const chains = useMemo(() => [...MAINNET_CHAINS, ...MAINNET_CHAINS], [])

  return (
    <div className="relative overflow-hidden py-5">
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-gray-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-gray-900 to-transparent z-10" />

      <motion.div
        className="flex gap-6 items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        {chains.map((chain, i) => (
          <div key={`${chain.id}-${i}`}
            className="flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]"
          >
            <ChainIcon chainId={chain.id} size={18} />
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{chain.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Stat ────────────────────────────────────────────────────────────────────
function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center px-5 sm:px-7"
    >
      <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">{value}</span>
      <span className="text-[11px] sm:text-xs text-gray-500 mt-1.5 uppercase tracking-[0.15em] font-medium">{label}</span>
    </motion.div>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center">
      {/* Background blends seamlessly — no overflow-hidden, no hard edges */}
      <HeroBackground />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid lg:grid-cols-[1.1fr,1fr] gap-12 lg:gap-8 items-center">
          {/* ── Left: Copy ── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-7"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20 text-amber-400/90 text-sm font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                15+ EVM Chains Supported
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-[3.25rem] sm:text-6xl lg:text-[4.25rem] xl:text-7xl font-display font-black tracking-tight leading-[1.08] mb-7"
            >
              <span className="block text-white">Create Tokens.</span>
              <span className="block text-white">Add Liquidity.</span>
              <span className="block mt-1.5">
                <span className="text-gray-500/80">On </span>
                <ChainRotator />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-lg mb-10"
            >
              Deploy an ERC20, get it verified on the block explorer,
              and list it on a DEX — all in one flow.{' '}
              <span className="text-gray-500">No Solidity. No CLI. Just connect&nbsp;your&nbsp;wallet.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35 transition-shadow duration-300 focus-visible:ring-4 focus-visible:ring-amber-400/50 focus-visible:outline-none"
                  aria-label="Create your token"
                >
                  Create a Token
                  <svg className="w-5 h-5 ml-2.5 -mr-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/guides?guide=token-creation"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-300 border border-white/[0.12] hover:border-white/25 rounded-xl hover:bg-white/[0.04] transition-all duration-300 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-none"
                  aria-label="Learn how it works"
                >
                  How It Works
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex items-center divide-x divide-white/[0.08]"
            >
              <Stat value="15+" label="Chains" delay={1.2} />
              <Stat value="<30s" label="Deploy Time" delay={1.3} />
              <Stat value="6+" label="DEXes" delay={1.4} />
            </motion.div>
          </div>

          {/* ── Right: Constellation ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <ChainConstellation />
          </motion.div>
        </div>
      </div>

      {/* Chain strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative z-10 mt-auto border-t border-b border-white/[0.04]"
      >
        <ChainStrip />
      </motion.div>
    </section>
  )
}
