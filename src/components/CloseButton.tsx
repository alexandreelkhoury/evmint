interface CloseButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export default function CloseButton({
  onClick,
  disabled = false,
  className = '',
  ariaLabel = 'Close'
}: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-[background-color,color,border-color,box-shadow,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
        disabled
          ? 'text-gray-600 cursor-not-allowed opacity-50'
          : 'text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer'
      } ${className}`}
      aria-label={ariaLabel}
      type="button"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}
