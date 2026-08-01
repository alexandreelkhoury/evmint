import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ChainIcon from '../../../components/ChainIcon'
import { MAINNET_CHAINS } from '../../../config/chains'
import OrbitingCircles from '../../../components/ui/OrbitingCircles'

const ORBIT_CHAINS = MAINNET_CHAINS.slice(0, 12)

// ─── Subtle background ──────────────────────────────────────────────────────
function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.04)_0%,_transparent_60%)] hidden lg:block" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.03)_0%,_transparent_55%)]" />
    </div>
  )
}

// ─── Orbiting chain icon with hover glow + tooltip ──────────────────────────
function OrbitChainIcon({ chain, iconSize }: { chain: typeof ORBIT_CHAINS[0]; iconSize: number }) {
  const [hovered, setHovered] = useState(false)
  const containerSize = iconSize + 16
  const isTrending = chain.trending

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: containerSize, height: containerSize }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Trending persistent glow */}
      {isTrending && (
        <div
          className="absolute inset-[-50%] rounded-full blur-xl animate-pulse"
          style={{ background: 'rgba(249,115,22,0.15)' }}
        />
      )}

      {/* Hover glow */}
      <div
        className="absolute inset-[-40%] rounded-full blur-xl transition-opacity duration-300"
        style={{
          background: isTrending ? 'rgba(249,115,22,0.2)' : 'rgba(251,191,36,0.12)',
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Icon container */}
      <div
        className="relative rounded-full flex items-center justify-center backdrop-blur-sm cursor-default transition-[background-color,color,border-color,box-shadow,opacity] duration-200"
        style={{
          width: containerSize,
          height: containerSize,
          background: hovered
            ? isTrending ? 'rgba(249,115,22,0.18)' : 'rgba(255,255,255,0.12)'
            : isTrending ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${
            isTrending
              ? hovered ? 'rgba(249,115,22,0.5)' : 'rgba(249,115,22,0.25)'
              : hovered ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'
          }`,
          transform: `scale(${hovered ? 1.18 : isTrending ? 1.05 : 1})`,
        }}
      >
        <ChainIcon chainId={chain.id} size={iconSize} />
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none" style={{ top: containerSize + 8 }}>
          <span className="px-2.5 py-1 rounded-md bg-gray-800/90 border border-white/10 text-xs font-medium text-gray-200 shadow-xl">
            {chain.name}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Constellation — CSS-animated orbiting circles ──────────────────────────
// Outer: Ethereum, Base, Monad, MegaETH, BSC (indices 0-4)
// Middle: Arbitrum, Optimism, Polygon, Avalanche (indices 5-8)
// Inner: Fantom, Gnosis, Moonbeam (indices 9-11)

function Constellation() {
  return (
    <div className="relative w-[480px] h-[480px] mx-auto hidden lg:flex items-center justify-center">
      {/* Center star — pulsing gold energy */}
      <motion.div
        className="absolute rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.03) 50%, transparent 70%)', width: 100, height: 100 }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 8, height: 8,
          background: 'rgba(251,191,36,0.6)',
          boxShadow: '0 0 24px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.15)',
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer ring — 5 chains */}
      <OrbitingCircles radius={190} duration={30} path iconSize={44}>
        {ORBIT_CHAINS.slice(0, 5).map(chain => (
          <OrbitChainIcon key={chain.id} chain={chain} iconSize={26} />
        ))}
      </OrbitingCircles>

      {/* Middle ring — 4 chains, reverse */}
      <OrbitingCircles radius={130} duration={24} reverse iconSize={40}>
        {ORBIT_CHAINS.slice(5, 9).map(chain => (
          <OrbitChainIcon key={chain.id} chain={chain} iconSize={22} />
        ))}
      </OrbitingCircles>

      {/* Inner ring — 3 chains */}
      <OrbitingCircles radius={75} duration={18} iconSize={36}>
        {ORBIT_CHAINS.slice(9, 12).map(chain => (
          <OrbitChainIcon key={chain.id} chain={chain} iconSize={20} />
        ))}
      </OrbitingCircles>
    </div>
  )
}

// ─── Rotating chain name ─────────────────────────────────────────────────────
// Short display names for the hero rotator to prevent line wrapping at large font sizes
const HERO_DISPLAY_NAMES: Record<number, string> = {
  4663: 'Robinhood',    // "Robinhood Chain" → "Robinhood"
}

// Chains to exclude from the hero rotator (name too long / breaks layout)
const HERO_EXCLUDED_CHAINS = new Set([480]) // World Chain

const HERO_ROTATOR_CHAINS = MAINNET_CHAINS.filter(c => !HERO_EXCLUDED_CHAINS.has(c.id))

function ChainRotator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % HERO_ROTATOR_CHAINS.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  const chain = HERO_ROTATOR_CHAINS[index]
  const displayName = HERO_DISPLAY_NAMES[chain.id] ?? chain.name

  return (
    <span className="inline-block relative min-w-[160px] whitespace-nowrap" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.span
          key={chain.id}
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
        >
          {displayName}
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
            className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-full ${
              chain.trending
                ? 'bg-orange-500/[0.08] border border-orange-500/20'
                : 'bg-white/[0.03] border border-white/[0.06]'
            }`}
          >
            <ChainIcon chainId={chain.id} size={18} />
            <span className={`text-sm font-medium whitespace-nowrap ${chain.trending ? 'text-orange-400' : 'text-gray-500'}`}>{chain.name}</span>
            {chain.trending && <span className="text-xs">🔥</span>}
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
    <section className="relative min-h-[80vh] flex flex-col justify-center">
      <HeroBackground />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
          {/* ── Left: Copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-7"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/[0.08] border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                15+ EVM Chains Supported
              </span>
            </motion.div>

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
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 transition-[background-color,box-shadow] duration-200 focus-visible:ring-4 focus-visible:ring-blue-400/50 focus-visible:outline-none"
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
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-300 border border-white/[0.12] hover:border-white/25 rounded-xl hover:bg-white/[0.04] transition-[background-color,color,border-color,box-shadow,opacity] duration-200 focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:outline-none"
                >
                  How It Works
                </a>
              </motion.div>
            </motion.div>

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

          {/* ── Right: Solar system ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <Constellation />
          </motion.div>
        </div>
      </div>

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
