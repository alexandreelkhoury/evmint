import { motion } from 'framer-motion'
import ChainBadge from './ChainBadge'

interface Stat {
  value: string | number
  label: string
  color: 'blue' | 'purple' | 'cyan'
}

interface StandardPageHeaderProps {
  // Badge
  badgeIcon: string
  badgeText: string
  badgeColors?: string

  // Title
  titleGradient: string
  titleWhite: string

  // Subtitle
  subtitle: string | React.ReactNode

  // Stats (always 3)
  stats: [Stat, Stat, Stat]

  // Network (optional)
  chainId?: number
  onNetworkClick?: () => void
  networkLabel?: string

  // Optional warning/info banner
  warningContent?: React.ReactNode
}

export default function StandardPageHeader({
  badgeIcon,
  badgeText,
  badgeColors = "from-blue-500/10 to-purple-500/10 border-blue-500/20",
  titleGradient,
  titleWhite,
  subtitle,
  stats,
  chainId,
  onNetworkClick,
  networkLabel = "Current network:",
  warningContent
}: StandardPageHeaderProps) {
  const colorMap = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400'
  }

  return (
    <motion.div
      className="text-center mb-10 sm:mb-20"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${badgeColors} mb-8`}
      >
        <span className="text-sm font-medium text-blue-400">
          {badgeIcon} {badgeText}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {titleGradient}
        </span>
        <br />
        <span className="text-white">{titleWhite}</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.div
        className="text-gray-300 max-w-4xl mx-auto text-xl sm:text-2xl mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-12"
      >
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4 sm:gap-0">
            {index > 0 && <div className="hidden sm:block w-px h-8 bg-gray-700 sm:mr-8"></div>}
            <div className="text-center">
              <div className={`text-lg sm:text-2xl font-bold ${colorMap[stat.color]}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Network Badge (only if chainId and onNetworkClick provided) */}
      {chainId !== undefined && onNetworkClick && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <span className="text-sm text-gray-400">{networkLabel}</span>
          <motion.button
            type="button"
            onClick={onNetworkClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer transition-[background-color,color,border-color,box-shadow,opacity] duration-200 hover:opacity-80"
            title="Click to change network"
          >
            <ChainBadge chainId={chainId} size="md" />
          </motion.button>
        </motion.div>
      )}

      {/* Warning/Info Banner */}
      {warningContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 max-w-2xl mx-auto"
        >
          {warningContent}
        </motion.div>
      )}
    </motion.div>
  )
}
