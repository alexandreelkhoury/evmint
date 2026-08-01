import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { lazy, Suspense, createContext, useContext, useEffect } from 'react'
import LazyWeb3Provider from './components/LazyWeb3Provider'
import { FirebaseProvider } from './components/FirebaseProvider'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import ScrollToTop from './components/ScrollToTop'
import { ToastContainer, useToasts } from './components/Toast'
import NetworkManagerLazy from './components/NetworkManagerLazy'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const CreateTokenPage = lazy(() => import('./pages/CreateTokenPage'))
const TokensPage = lazy(() => import('./pages/TokensPage'))
const LiquidityPage = lazy(() => import('./pages/LiquidityPage'))
const GuidePage = lazy(() => import('./pages/GuidePage'))
const GuidesPage = lazy(() => import('./pages/GuidesPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'))
const LegalDisclaimersPage = lazy(() => import('./pages/LegalDisclaimersPage'))
const MultiChainTokenCreatorPage = lazy(() => import('./pages/MultiChainTokenCreatorPage'))
const ERC20TokenGeneratorPage = lazy(() => import('./pages/ERC20TokenGeneratorPage'))
const MemeCoinCreatorPage = lazy(() => import('./pages/MemeCoinCreatorPage'))
const CryptocurrencyCreatorPage = lazy(() => import('./pages/CryptocurrencyCreatorPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const TokenDetailPage = lazy(() => import('./pages/TokenDetailPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ServerErrorPage = lazy(() => import('./pages/ServerErrorPage'))

// Create a context for toasts to be used globally

const ToastContext = createContext<ReturnType<typeof useToasts> | null>(null)

export const useGlobalToasts = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useGlobalToasts must be used within ToastProvider')
  }
  return context
}

function AppContent() {
  const toastManager = useToasts()

  // Remove splash screen once React has rendered
  useEffect(() => {
    const splash = document.getElementById('splash')
    if (splash) splash.remove()
  }, [])

  return (
    <ErrorBoundary>
      <ToastContext.Provider value={toastManager}>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:rounded-lg focus:text-sm focus:font-semibold">
            Skip to content
          </a>
          <ScrollToTop />
          <NetworkManagerLazy />
          <Header />
          <main id="main-content" className="pt-14 sm:pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0 flex-1">
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreateTokenPage />} />
                <Route path="/tokens" element={<TokensPage />} />
                <Route path="/liquidity" element={<LiquidityPage />} />
                {/* /guide has no :guideId, so GuidePage always rendered its null branch — a soft 404 */}
                <Route path="/guide" element={<Navigate to="/guides" replace />} />
                <Route path="/guides" element={<GuidesPage />} />
                <Route path="/guides/:guideId" element={<GuidePage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/disclaimers" element={<LegalDisclaimersPage />} />
                <Route path="/multi-chain-token-creator" element={<MultiChainTokenCreatorPage />} />
                <Route path="/erc20-token-generator" element={<ERC20TokenGeneratorPage />} />
                <Route path="/meme-coin-creator" element={<MemeCoinCreatorPage />} />
                <Route path="/cryptocurrency-creator" element={<CryptocurrencyCreatorPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/token/:address" element={<TokenDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <MobileBottomNav />
          <ToastContainer
            toasts={toastManager.toasts}
            onRemove={toastManager.removeToast}
            position="top-right"
          />
        </div>
      </ToastContext.Provider>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <HelmetProvider>
      <FirebaseProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <LazyWeb3Provider>
            <AppContent />
          </LazyWeb3Provider>
        </Router>
      </FirebaseProvider>
    </HelmetProvider>
  )
}

export default App
