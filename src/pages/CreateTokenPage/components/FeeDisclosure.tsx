interface FeeDisclosureProps {
  feeAmount: string
  nativeTokenName: string
}

export default function FeeDisclosure({ feeAmount, nativeTokenName }: FeeDisclosureProps) {
  return (
    <div className="mt-5 px-4 py-3 bg-blue-500/[0.05] border border-blue-500/20 rounded-xl flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300">
          <span className="font-medium">Token Creation Fee:</span>{' '}
          <span className="text-blue-400 font-semibold tabular-nums">{feeAmount} {nativeTokenName}</span>
          <span className="text-gray-400"> + gas fees</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Covers platform maintenance and development</p>
      </div>
    </div>
  )
}
