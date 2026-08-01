import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { useEffect } from 'react'
import SEO from '../components/SEO'

export default function PrivacyPolicyPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'privacy_policy')
  }, [analytics])

  return (
    <>
      <SEO
        title="Privacy Policy - EVMint"
        description="Privacy policy for EVMint token creator platform."
        canonical="/privacy"
      />

      <div className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
              <p className="mb-3">We collect minimal information to provide our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Wallet Address:</strong> Your public blockchain wallet address when you connect</li>
                <li><strong>Analytics Data:</strong> Page views, button clicks, and interactions via Firebase Analytics</li>
                <li><strong>Transaction Data:</strong> On-chain token deployment transactions (publicly visible on blockchain)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our token creation service</li>
                <li>To process your token deployment transactions</li>
                <li>To improve our platform through analytics</li>
                <li>To communicate service updates (if you opt-in)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Cookies and Tracking</h2>
              <p className="mb-3">We use Firebase Analytics to understand how users interact with our platform. This includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cookies for analytics purposes</li>
                <li>LocalStorage for user preferences</li>
                <li>Session data to maintain your connection</li>
              </ul>
              <p className="mt-3">You can disable cookies in your browser settings, though this may affect functionality.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Data Sharing</h2>
              <p className="mb-3">We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Firebase (Google) for analytics and hosting</li>
                <li><strong>Blockchain Networks:</strong> Transaction data is publicly recorded on-chain</li>
                <li><strong>Legal Requirements:</strong> If required by law or legal process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Data Security</h2>
              <p>We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. Your Rights</h2>
              <p className="mb-3">Depending on your location, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of analytics tracking</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">7. Third-Party Services</h2>
              <p className="mb-3">We integrate with third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Wallet Providers:</strong> MetaMask, Coinbase Wallet, etc. (governed by their privacy policies)</li>
                <li><strong>Blockchain Networks:</strong> Ethereum, Base, Arbitrum, etc. (public ledgers)</li>
                <li><strong>Firebase:</strong> Google's analytics and hosting (governed by Google's privacy policy)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">8. Children's Privacy</h2>
              <p>Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us through our platform or via the information provided on our website.</p>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
