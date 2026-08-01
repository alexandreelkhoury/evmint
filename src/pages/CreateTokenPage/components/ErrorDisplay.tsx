interface ErrorDisplayProps {
  error: {
    message?: string
  }
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
      <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="text-sm font-medium text-red-300">Token creation failed</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
    </div>
  )
}
