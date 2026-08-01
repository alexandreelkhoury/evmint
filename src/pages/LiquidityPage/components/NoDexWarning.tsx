interface NoDexWarningProps {
  isV2Available: boolean
}

export default function NoDexWarning({ isV2Available }: NoDexWarningProps) {
  if (isV2Available) return null

  return (
    <div className="mb-5 flex items-start gap-2.5 p-3 bg-yellow-500/[0.06] border border-yellow-500/15 rounded-xl">
      <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-xs text-yellow-300 leading-relaxed">
        Uniswap V2 is not available on this network. Please switch to a supported mainnet.
      </p>
    </div>
  )
}
