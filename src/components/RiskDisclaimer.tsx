import { Link } from 'react-router-dom'

export default function RiskDisclaimer() {
  return (
    <p className="mt-6 text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto text-center">
      Token creation and liquidity provision involve financial risk. This tool deploys smart contracts on your behalf — you are solely responsible for compliance with applicable laws. EVMint does not provide investment advice.{' '}
      <Link to="/disclaimers" className="underline underline-offset-2 hover:text-gray-400 transition-colors">
        Full disclaimers
      </Link>
    </p>
  )
}
