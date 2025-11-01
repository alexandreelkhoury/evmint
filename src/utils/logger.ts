/**
 * Application logging utility
 * Provides environment-aware logging with proper formatting
 */

const isDevelopment = import.meta.env.DEV
const isProd = import.meta.env.PROD

/**
 * Log levels for filtering
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

/**
 * Current log level (can be configured via env)
 */
const currentLogLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.WARN

/**
 * Check if a log level should be output
 */
function shouldLog(level: LogLevel): boolean {
  return level >= currentLogLevel
}

/**
 * Format timestamp for logs
 */
function getTimestamp(): string {
  return new Date().toISOString().split('T')[1].slice(0, -1) // HH:MM:SS.mmm
}

/**
 * Format log prefix
 */
function getPrefix(level: string): string {
  return `[${getTimestamp()}] [${level}]`
}

/**
 * Logger class for organized logging
 */
class Logger {
  private context?: string

  constructor(context?: string) {
    this.context = context
  }

  /**
   * Create a new logger with context
   */
  withContext(context: string): Logger {
    return new Logger(context)
  }

  /**
   * Debug level logging (development only)
   */
  debug(...args: unknown[]): void {
    if (!shouldLog(LogLevel.DEBUG)) return

    const prefix = this.context
      ? `${getPrefix('DEBUG')} [${this.context}]`
      : getPrefix('DEBUG')

    console.debug(prefix, ...args)
  }

  /**
   * Info level logging
   */
  info(...args: unknown[]): void {
    if (!shouldLog(LogLevel.INFO)) return

    const prefix = this.context
      ? `${getPrefix('INFO')} [${this.context}]`
      : getPrefix('INFO')

    console.info(prefix, ...args)
  }

  /**
   * Warning level logging
   */
  warn(...args: unknown[]): void {
    if (!shouldLog(LogLevel.WARN)) return

    const prefix = this.context
      ? `${getPrefix('WARN')} [${this.context}]`
      : getPrefix('WARN')

    console.warn(prefix, ...args)
  }

  /**
   * Error level logging (always logged)
   */
  error(...args: unknown[]): void {
    if (!shouldLog(LogLevel.ERROR)) return

    const prefix = this.context
      ? `${getPrefix('ERROR')} [${this.context}]`
      : getPrefix('ERROR')

    console.error(prefix, ...args)
  }

  /**
   * Log success messages (with emoji in dev)
   */
  success(...args: unknown[]): void {
    if (!shouldLog(LogLevel.INFO)) return

    const emoji = isDevelopment ? '✅' : ''
    const prefix = this.context
      ? `${getPrefix('SUCCESS')} [${this.context}]`
      : getPrefix('SUCCESS')

    console.log(prefix, emoji, ...args)
  }

  /**
   * Log transaction-related info
   */
  transaction(action: string, details: Record<string, unknown>): void {
    if (!shouldLog(LogLevel.INFO)) return

    const emoji = isDevelopment ? '🔗' : ''
    const prefix = this.context
      ? `${getPrefix('TX')} [${this.context}]`
      : getPrefix('TX')

    console.log(prefix, emoji, action, details)
  }

  /**
   * Log wallet-related info
   */
  wallet(action: string, details: Record<string, unknown>): void {
    if (!shouldLog(LogLevel.INFO)) return

    const emoji = isDevelopment ? '👛' : ''
    const prefix = this.context
      ? `${getPrefix('WALLET')} [${this.context}]`
      : getPrefix('WALLET')

    console.log(prefix, emoji, action, details)
  }

  /**
   * Log blockchain-related info
   */
  blockchain(action: string, details: Record<string, unknown>): void {
    if (!shouldLog(LogLevel.INFO)) return

    const emoji = isDevelopment ? '⛓️' : ''
    const prefix = this.context
      ? `${getPrefix('CHAIN')} [${this.context}]`
      : getPrefix('CHAIN')

    console.log(prefix, emoji, action, details)
  }

  /**
   * Log performance metrics
   */
  perf(label: string, duration: number): void {
    if (!shouldLog(LogLevel.DEBUG)) return

    const emoji = isDevelopment ? '⚡' : ''
    const prefix = this.context
      ? `${getPrefix('PERF')} [${this.context}]`
      : getPrefix('PERF')

    console.log(prefix, emoji, label, `${duration.toFixed(2)}ms`)
  }

  /**
   * Group related logs together
   */
  group(label: string): void {
    if (!isDevelopment) return
    console.group(label)
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (!isDevelopment) return
    console.groupEnd()
  }

  /**
   * Log a table (development only)
   */
  table(data: unknown): void {
    if (!isDevelopment) return
    console.table(data)
  }
}

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

/**
 * Default logger instance
 */
export const logger = new Logger()

/**
 * Create context-specific loggers
 */
export const createLogger = (context: string): Logger => new Logger(context)

/**
 * Specialized loggers for different parts of the app
 */
export const loggers = {
  token: createLogger('Token'),
  liquidity: createLogger('Liquidity'),
  wallet: createLogger('Wallet'),
  network: createLogger('Network'),
  contract: createLogger('Contract'),
  ui: createLogger('UI'),
  api: createLogger('API'),
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  label: string,
  fn: () => T,
  loggerInstance: Logger = logger
): T {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  loggerInstance.perf(label, duration)
  return result
}

/**
 * Measure async function execution time
 */
export async function measurePerformanceAsync<T>(
  label: string,
  fn: () => Promise<T>,
  loggerInstance: Logger = logger
): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start
  loggerInstance.perf(label, duration)
  return result
}

// ============================================================================
// CONDITIONAL LOGGING HELPERS
// ============================================================================

/**
 * Log only in development
 */
export const devLog = (...args: unknown[]): void => {
  if (isDevelopment) {
    console.log(...args)
  }
}

/**
 * Log only in production (for critical errors)
 */
export const prodLog = (...args: unknown[]): void => {
  if (isProd) {
    console.log(...args)
  }
}

/**
 * Warn only in development
 */
export const devWarn = (...args: unknown[]): void => {
  if (isDevelopment) {
    console.warn(...args)
  }
}

/**
 * Error logging (always logged but formatted differently)
 */
export const errorLog = (error: Error, context?: string): void => {
  const prefix = context ? `[ERROR] [${context}]` : '[ERROR]'
  console.error(prefix, {
    message: error.message,
    stack: isDevelopment ? error.stack : undefined,
    name: error.name,
    timestamp: new Date().toISOString(),
  })
}

// ============================================================================
// EXPORTS
// ============================================================================

export default logger
