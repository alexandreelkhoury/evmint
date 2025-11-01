import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import PrivyProvider from './components/PrivyProvider'
import { FirebaseProvider } from './components/FirebaseProvider'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { ToastContainer, useToasts } from './components/Toast'
import NetworkManager from './components/NetworkManager'
import HomePage from './pages/HomePage'
import CreateTokenPage from './pages/CreateTokenPage'
import TokensPage from './pages/TokensPage'
import LiquidityPage from './pages/LiquidityPage'
import GuidePage from './pages/GuidePage'
import GuidesPage from './pages/GuidesPage'
import FAQPage from './pages/FAQPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import RiskDisclosurePage from './pages/RiskDisclosurePage'
import LegalDisclaimersPage from './pages/LegalDisclaimersPage'
import { LiquidityProvider } from './contexts/LiquidityContext'

// Create a context for toasts to be used globally
import { createContext, useContext } from 'react'

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
    <ToastContext.Provider value={toastManager}>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <ScrollToTop />
        <NetworkManager />
        <Header />
        <main className="pt-16 flex-1">
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
            <Route path="/cookies" element={<CookiePolicyPage />} />
            <Route path="/risks" element={<RiskDisclosurePage />} />
            <Route path="/disclaimers" element={<LegalDisclaimersPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer 
          toasts={toastManager.toasts} 
          onRemove={toastManager.removeToast} 
          position="top-right"
        />
      </div>
    </ToastContext.Provider>
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
