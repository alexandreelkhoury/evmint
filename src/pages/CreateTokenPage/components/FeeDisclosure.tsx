interface FeeDisclosureProps {
  feeAmount: string
  nativeTokenName: string
}

export default function FeeDisclosure({ feeAmount, nativeTokenName }: FeeDisclosureProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Creation fee</span>
      </div>
      <div className="text-sm">
        <span className="font-medium text-white">{feeAmount} {nativeTokenName}</span>
        <span className="text-gray-500 ml-1.5">+ gas</span>
      </div>
    </div>
  )
}
