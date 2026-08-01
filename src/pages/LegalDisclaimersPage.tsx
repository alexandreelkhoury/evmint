import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { useEffect } from 'react'
import SEO from '../components/SEO'

export default function LegalDisclaimersPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'legal_disclaimers')
  }, [analytics])

  return (
    <>
      <SEO
        title="Legal Disclaimers - EVMint"
        description="Legal disclaimers and risk disclosures for EVMint token creator platform."
        canonical="/disclaimers"
      />

      <div className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">Legal Disclaimers</h1>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. No Financial Advice</h2>
              <p>EVMint does not provide financial, investment, tax, or legal advice. The information provided on this platform is for general informational purposes only and should not be construed as professional advice. You should consult with qualified professionals before making any financial or legal decisions.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. No Guarantee of Success</h2>
              <p>Creating a token through EVMint does not guarantee financial success, adoption, or value. The success of your token depends on numerous factors outside our control, including market conditions, community support, and regulatory environment.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Cryptocurrency Risks</h2>
              <p className="mb-3">Cryptocurrency and blockchain technology involve significant risks:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Volatility:</strong> Cryptocurrency prices can be extremely volatile</li>
                <li><strong>Loss of Funds:</strong> You may lose all funds invested in cryptocurrency</li>
                <li><strong>Irreversible Transactions:</strong> Blockchain transactions cannot be reversed</li>
                <li><strong>Technical Risks:</strong> Smart contracts may contain bugs or vulnerabilities</li>
                <li><strong>Regulatory Risk:</strong> Laws governing cryptocurrency may change</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. No Warranties</h2>
              <p className="mb-3">EVMint provides the service "AS IS" and "AS AVAILABLE" without any warranties, express or implied, including but not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties regarding security, reliability, or accuracy</li>
                <li>Warranties that the service will be uninterrupted or error-free</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Regulatory Compliance</h2>
              <p>You are responsible for determining whether creating, selling, or distributing tokens complies with laws in your jurisdiction. Tokens may be considered securities in some jurisdictions and require registration or exemptions. Consult legal counsel before proceeding.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Third-Party Risks</h2>
              <p className="mb-3">EVMint integrates with third-party services over which we have no control:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Blockchain networks may experience downtime or congestion</li>
                <li>Wallet providers may have security vulnerabilities</li>
                <li>DEX platforms may have liquidity or technical issues</li>
                <li>Block explorers may display inaccurate information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Smart Contract Risks</h2>
              <p>While we use audited OpenZeppelin contracts, smart contracts carry inherent risks including bugs, exploits, and unexpected behavior. We cannot guarantee the security or functionality of deployed contracts.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. No Custody of Funds</h2>
              <p>EVMint is a non-custodial platform. We do not hold, control, or have access to your cryptocurrency or private keys. You are solely responsible for the security of your wallet and funds.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Tax Obligations</h2>
              <p>Creating, selling, or trading tokens may have tax implications in your jurisdiction. You are responsible for understanding and complying with all applicable tax laws and reporting requirements.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. No Liability</h2>
              <p>To the maximum extent permitted by law, EVMint and its operators, employees, and affiliates shall not be liable for any damages arising from your use of the service, including but not limited to loss of funds, data, profits, or business opportunities.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">11. Use at Your Own Risk</h2>
              <p>By using EVMint, you acknowledge that you understand these risks and disclaimers, and you agree to use the service entirely at your own risk.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
