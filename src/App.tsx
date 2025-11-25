import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { lazy, Suspense, createContext, useContext } from 'react'
import PrivyProvider from './components/PrivyProvider'
import { FirebaseProvider } from './components/FirebaseProvider'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { ToastContainer, useToasts } from './components/Toast'
import NetworkManager from './components/NetworkManager'
import LoadingSpinner from './components/LoadingSpinner'
import { LiquidityProvider } from './contexts/LiquidityContext'

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

  return (
    <ErrorBoundary>
      <ToastContext.Provider value={toastManager}>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <ScrollToTop />
          <NetworkManager />
          <Header />
          <main className="pt-16 flex-1">
            <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreateTokenPage />} />
                <Route path="/tokens" element={<TokensPage />} />
                <Route path="/liquidity" element={
                  <LiquidityProvider>
                    <LiquidityPage />
                  </LiquidityProvider>
                } />
                <Route path="/guide" element={<GuidePage />} />
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
                <Route path="/500" element={<ServerErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
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
      <PrivyProvider>
        <FirebaseProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppContent />
          </Router>
        </FirebaseProvider>
      </PrivyProvider>
    </HelmetProvider>
  )
}

export default App
