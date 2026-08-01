import { motion } from 'framer-motion'
import { useChainId } from 'wagmi'
import { getChainName, V2_LIQUIDITY_CHAINS } from '../../../config/chains'

interface NoDexWarningProps {
  isV2Available: boolean
}

// Availability is sourced from `features.hasV2Liquidity` in src/config/chains.ts
// (via V2_LIQUIDITY_CHAINS). Fourteen mainnets qualify, which is too many to
// read in one sentence, so we suggest the most widely used ones — a chain that
// loses V2 support drops out of this list automatically.
const SUGGESTED_CHAIN_IDS = [
  1,     // Ethereum
  8453,  // Base
  42161, // Arbitrum
  10,    // Optimism
  137,   // Polygon
  56     // BSC
]

function getSuggestedChainsSentence(): string {
  const names = SUGGESTED_CHAIN_IDS
    .map(id => V2_LIQUIDITY_CHAINS.find(chain => chain.id === id))
    .filter((chain): chain is NonNullable<typeof chain> => Boolean(chain))
    .map(chain => chain.name)

  if (names.length === 0) return ''
  if (names.length === 1) return names[0]

  return `${names.slice(0, -1).join(', ')}, or ${names[names.length - 1]}`
}

export default function NoDexWarning({ isV2Available }: NoDexWarningProps) {
  const chainId = useChainId()

  if (isV2Available) return null

  const chainName = getChainName(chainId)
  const suggestedChains = getSuggestedChainsSentence()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-8 max-w-2xl mx-auto"
    >
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-yellow-300 font-semibold">Network Notice</div>
            <div className="text-yellow-200 text-sm">
              Liquidity pools aren't available on {chainName}.
              {suggestedChains && ` Switch to ${suggestedChains}.`}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
