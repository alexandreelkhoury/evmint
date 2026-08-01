import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { useEffect } from 'react'
import SEO from '../components/SEO'

export default function TermsOfServicePage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'terms_of_service')
  }, [analytics])

  return (
    <>
      <SEO
        title="Terms of Service - EVMint"
        description="Terms of service for EVMint token creator platform."
        canonical="/terms"
      />

      <div className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using EVMint, you accept and agree to be bound by these Terms of Service. If you do not agree, do not use our service.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
              <p className="mb-3">EVMint provides a platform to deploy ERC20 tokens on EVM-compatible blockchains. Our service includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Token deployment interface</li>
                <li>Smart contract generation using OpenZeppelin standards</li>
                <li>Optional liquidity management tools</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. User Responsibilities</h2>
              <p className="mb-3">You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintaining the security of your wallet and private keys</li>
                <li>All transactions made through your wallet</li>
                <li>Compliance with applicable laws and regulations</li>
                <li>Ensuring your token does not violate intellectual property rights</li>
                <li>Payment of all blockchain gas fees and platform fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Fees</h2>
              <p className="mb-3">Platform fees are displayed before each transaction. Fees are non-refundable. You are also responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Blockchain gas fees (paid to network validators)</li>
                <li>Platform deployment fees (paid to EVMint)</li>
                <li>Any third-party service fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. No Financial Advice</h2>
              <p>EVMint does not provide financial, investment, or legal advice. Creating a token does not constitute an investment recommendation. You are solely responsible for your financial decisions.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Prohibited Uses</h2>
              <p className="mb-3">You may not use EVMint to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create tokens for illegal purposes</li>
                <li>Engage in fraud, scams, or deceptive practices</li>
                <li>Violate intellectual property rights</li>
                <li>Create securities without proper registration</li>
                <li>Engage in money laundering or terrorist financing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Disclaimers</h2>
              <p className="mb-3">EVMint is provided "AS IS" without warranties of any kind. We do not guarantee:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Uninterrupted or error-free service</li>
                <li>Security of your transactions or funds</li>
                <li>Success or profitability of your token</li>
                <li>Compatibility with future blockchain upgrades</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, EVMint and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or cryptocurrency.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Indemnification</h2>
              <p>You agree to indemnify and hold harmless EVMint from any claims, damages, or expenses arising from your use of the service or violation of these terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. Termination</h2>
              <p>We reserve the right to terminate or suspend access to our service at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our business.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">11. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">12. Changes to Terms</h2>
              <p>We may modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">13. Contact</h2>
              <p>For questions about these Terms, please contact us through our platform.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
