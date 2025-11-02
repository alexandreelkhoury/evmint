import { useFirebaseAnalytics } from '../components/FirebaseProvider'
import { trackPageView } from '../utils/analytics'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { layout, typography, colors } from '../styles/designSystem'

export default function LegalDisclaimersPage() {
  const analytics = useFirebaseAnalytics()

  useEffect(() => {
    trackPageView(analytics, 'legal_disclaimers')
  }, [analytics])

  return (
    <>
      <SEO 
        title="Legal Disclaimers - EVMint"
        description="Important legal disclaimers for EVMint. Understand our liability limitations and legal protections."
        keywords="legal disclaimers, liability limitations, Web3 disclaimers, cryptocurrency disclaimers, Base blockchain legal"
        canonical="https://base-token-launcher.web.app/disclaimers"
      />

      <div className={`${layout.pageContainer} py-12`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`${typography.pageTitle} mb-6`}>
              Legal Disclaimers
            </h1>
            <p className={`${typography.subtitle} text-xl`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className={`${colors.glassCard} rounded-3xl p-8 lg:p-12 space-y-8`}>
            
            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>1. General Disclaimer</h2>
              <p className={`${typography.bodyText} mb-4`}>
                The information and services provided by EVMint ("Platform") are for general informational and educational purposes only. Nothing contained on this platform constitutes professional advice of any kind.
              </p>
              <p className={typography.bodyText}>
                <strong>USE AT YOUR OWN RISK:</strong> By using this platform, you acknowledge and agree that you are solely responsible for your own decisions and actions.
              </p>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>2. No Investment or Financial Advice</h2>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
                <h3 className={`${typography.sectionTitle} text-xl mb-3 text-yellow-400`}>⚠️ IMPORTANT NOTICE</h3>
                <p className={`${typography.bodyText} mb-4`}>
                  <strong>NO INVESTMENT ADVICE:</strong> Nothing on this platform constitutes investment, financial, legal, tax, or professional advice.
                </p>
                <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                  <li>• We do not provide investment recommendations</li>
                  <li>• We do not endorse any particular token or investment strategy</li>
                  <li>• All content is for informational purposes only</li>
                  <li>• Consult qualified professionals before making financial decisions</li>
                </ul>
              </div>

              <p className={typography.bodyText}>
                Any content that discusses financial topics is purely educational and should not be relied upon for investment decisions.
              </p>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>3. Platform Disclaimers</h2>
              
              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-blue-400`}>3.1 Service Availability</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6 mb-4`}>
                <li>• <strong>No Uptime Guarantee:</strong> We do not guarantee continuous or error-free operation</li>
                <li>• <strong>Maintenance Windows:</strong> Service may be interrupted for maintenance</li>
                <li>• <strong>Third-Party Dependencies:</strong> Service availability depends on external services</li>
                <li>• <strong>Network Congestion:</strong> Blockchain network issues may affect functionality</li>
              </ul>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-blue-400`}>3.2 Accuracy of Information</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6 mb-4`}>
                <li>• <strong>No Accuracy Guarantee:</strong> Information may be incomplete, inaccurate, or outdated</li>
                <li>• <strong>Third-Party Data:</strong> We rely on external data sources that may be unreliable</li>
                <li>• <strong>Real-Time Updates:</strong> Information may not reflect the most current data</li>
                <li>• <strong>User Responsibility:</strong> Verify all information independently</li>
              </ul>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-blue-400`}>3.3 Technical Performance</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• <strong>No Performance Warranty:</strong> Software may contain bugs or errors</li>
                <li>• <strong>Compatibility Issues:</strong> May not work with all devices or browsers</li>
                <li>• <strong>Security Limitations:</strong> No system is completely secure</li>
                <li>• <strong>Updates and Changes:</strong> Features may change or be discontinued</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>4. Cryptocurrency and DeFi Disclaimers</h2>
              
              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-orange-400`}>4.1 High Risk Activity</h3>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-4">
                <p className={`${typography.bodyText} mb-3`}>
                  <strong>EXTREME RISK WARNING:</strong> Cryptocurrency and DeFi activities involve substantial risk of loss.
                </p>
                <ul className={`${typography.bodyText} space-y-1 ml-6 text-sm`}>
                  <li>• Total loss of funds is possible</li>
                  <li>• Prices are extremely volatile</li>
                  <li>• No regulatory protection exists</li>
                  <li>• Technology is experimental and unproven</li>
                </ul>
              </div>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-orange-400`}>4.2 Token Creation Disclaimers</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6 mb-4`}>
                <li>• <strong>No Success Guarantee:</strong> Created tokens may have no value or market</li>
                <li>• <strong>Regulatory Risk:</strong> Tokens may be subject to securities regulations</li>
                <li>• <strong>Technical Risk:</strong> Smart contracts may contain bugs or vulnerabilities</li>
                <li>• <strong>Intellectual Property:</strong> Users are responsible for respecting IP rights</li>
              </ul>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-orange-400`}>4.3 Third-Party Protocol Risk</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• <strong>Uniswap Dependency:</strong> We rely on Uniswap V3 protocol functionality</li>
                <li>• <strong>Base Network Risk:</strong> Base blockchain technical issues may affect operations</li>
                <li>• <strong>Smart Contract Risk:</strong> Third-party contracts may be exploited or fail</li>
                <li>• <strong>No Control:</strong> We cannot control or fix third-party protocol issues</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>5. Limitation of Liability</h2>
              
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 mb-4">
                <h3 className={`${typography.sectionTitle} text-xl mb-3 text-red-400`}>MAXIMUM LIABILITY LIMITATION</h3>
                <p className={`${typography.bodyText} mb-4 font-semibold`}>
                  TO THE FULLEST EXTENT PERMITTED BY LAW:
                </p>
                <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                  <li>• <strong>TOTAL LIABILITY CAP:</strong> Our maximum liability is limited to $100 USD</li>
                  <li>• <strong>NO CONSEQUENTIAL DAMAGES:</strong> We are not liable for indirect, incidental, special, or consequential damages</li>
                  <li>• <strong>NO LOST PROFITS:</strong> We are not liable for lost profits, revenue, or business opportunities</li>
                  <li>• <strong>NO DATA LOSS:</strong> We are not liable for loss of data, tokens, or digital assets</li>
                </ul>
              </div>

              <p className={typography.bodyText}>
                This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, or otherwise).
              </p>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>6. External Links and Third Parties</h2>
              
              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-blue-400`}>6.1 Third-Party Links</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6 mb-4`}>
                <li>• <strong>No Endorsement:</strong> Links to external sites do not constitute endorsement</li>
                <li>• <strong>No Control:</strong> We do not control third-party websites or services</li>
                <li>• <strong>User Risk:</strong> You use third-party services at your own risk</li>
                <li>• <strong>Review Policies:</strong> Review third-party terms and privacy policies</li>
              </ul>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-blue-400`}>6.2 Third-Party Content</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• <strong>No Responsibility:</strong> We are not responsible for third-party content accuracy</li>
                <li>• <strong>User-Generated Content:</strong> User content does not represent our views</li>
                <li>• <strong>Moderation Limits:</strong> We cannot monitor all user content</li>
                <li>• <strong>Report Issues:</strong> Report inappropriate content to us</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>7. Regulatory Compliance</h2>
              
              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-purple-400`}>7.1 No Legal or Regulatory Advice</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6 mb-4`}>
                <li>• We do not provide legal, regulatory, or compliance advice</li>
                <li>• Users are responsible for complying with applicable laws</li>
                <li>• Regulatory landscape is rapidly changing</li>
                <li>• Consult qualified legal professionals</li>
              </ul>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-purple-400`}>7.2 Jurisdictional Variations</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6 mb-4`}>
                <li>• Laws vary significantly by jurisdiction</li>
                <li>• Some services may not be available in certain locations</li>
                <li>• Users must comply with local regulations</li>
                <li>• We may restrict access based on location</li>
              </ul>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-purple-400`}>7.3 Anti-Money Laundering (AML)</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• Users must not engage in money laundering activities</li>
                <li>• Comply with sanctions and restricted party lists</li>
                <li>• We may report suspicious activities to authorities</li>
                <li>• Know Your Customer (KYC) procedures may apply</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>8. Intellectual Property</h2>
              
              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-green-400`}>8.1 Our Rights</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6 mb-4`}>
                <li>• Platform design, code, and content are protected by intellectual property laws</li>
                <li>• Users may not copy, modify, or distribute our proprietary content</li>
                <li>• Trademarks and logos are owned by their respective owners</li>
                <li>• Unauthorized use may result in legal action</li>
              </ul>

              <h3 className={`${typography.sectionTitle} text-xl mb-3 text-green-400`}>8.2 User Responsibilities</h3>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• Users must respect intellectual property rights when creating tokens</li>
                <li>• Do not use copyrighted names, symbols, or imagery without permission</li>
                <li>• Trademark violations may result in account suspension</li>
                <li>• Users indemnify us against IP infringement claims</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>9. Privacy and Data</h2>
              <p className={`${typography.bodyText} mb-4`}>
                Data collection and use are governed by our Privacy Policy. Key points:
              </p>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• We collect minimal personal information</li>
                <li>• Blockchain transactions are public and permanent</li>
                <li>• Third-party services have their own privacy policies</li>
                <li>• Review our <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a> for details</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>10. Force Majeure</h2>
              <p className={`${typography.bodyText} mb-4`}>
                We are not liable for delays or failures caused by events beyond our reasonable control, including:
              </p>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• Natural disasters, pandemics, or acts of war</li>
                <li>• Government actions, regulations, or sanctions</li>
                <li>• Internet outages or infrastructure failures</li>
                <li>• Blockchain network issues or forks</li>
                <li>• Cyber attacks or security breaches</li>
                <li>• Third-party service provider failures</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>11. Indemnification</h2>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                <p className={`${typography.bodyText} mb-4`}>
                  <strong>USER INDEMNIFICATION:</strong> By using the platform, you agree to indemnify and hold harmless EVMint from:
                </p>
                <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                  <li>• Any claims arising from your use of the platform</li>
                  <li>• Violations of these terms or applicable laws</li>
                  <li>• Intellectual property infringement claims</li>
                  <li>• Token creation or trading activities</li>
                  <li>• Damages to third parties caused by your actions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>12. Modifications and Updates</h2>
              <p className={`${typography.bodyText} mb-4`}>
                We reserve the right to modify these disclaimers at any time. Changes will be effective immediately upon posting.
              </p>
              <ul className={`${typography.bodyText} space-y-2 ml-6`}>
                <li>• Check this page regularly for updates</li>
                <li>• Continued use constitutes acceptance of changes</li>
                <li>• Material changes may be highlighted or announced</li>
                <li>• Your responsibility to stay informed of current terms</li>
              </ul>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>13. Severability</h2>
              <p className={typography.bodyText}>
                If any provision of these disclaimers is found to be unenforceable or invalid, the remaining provisions will continue in full force and effect. Invalid provisions will be interpreted to achieve their intended purpose to the maximum extent possible.
              </p>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>14. Governing Law</h2>
              <p className={typography.bodyText}>
                These disclaimers are governed by the laws of [JURISDICTION], without regard to conflict of law principles. Any disputes will be resolved in the courts of [JURISDICTION].
              </p>
            </section>

            <section>
              <h2 className={`${typography.sectionTitle} text-2xl mb-4`}>15. Contact Information</h2>
              <p className={`${typography.bodyText} mb-4`}>
                For questions about these Legal Disclaimers:
              </p>
              <div className={`${typography.bodyText} space-y-2`}>
                <p>Legal: <a href="mailto:legal@base-token-launcher.com" className="text-blue-400 hover:text-blue-300">legal@base-token-launcher.com</a></p>
                <p>Support: <a href="mailto:support@base-token-launcher.com" className="text-blue-400 hover:text-blue-300">support@base-token-launcher.com</a></p>
                <p>Website: <a href="https://base-token-launcher.web.app" className="text-blue-400 hover:text-blue-300">base-token-launcher.web.app</a></p>
              </div>
            </section>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mt-8">
              <p className={`${typography.bodyText} text-center font-medium`}>
                <strong>ACKNOWLEDGMENT:</strong> By using EVMint, you acknowledge that you have read, understood, and agree to these Legal Disclaimers.
              </p>
            </div>

          </div>

        </motion.div>
      </div>
    </>
  )
}