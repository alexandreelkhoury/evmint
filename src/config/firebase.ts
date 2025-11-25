import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase config in development
if (import.meta.env.DEV) {
  const missingVars = []
  if (!firebaseConfig.apiKey) missingVars.push('VITE_FIREBASE_API_KEY')
  if (!firebaseConfig.authDomain) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN')
  if (!firebaseConfig.projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID')

  if (missingVars.length > 0) {
    console.warn('[Firebase] Missing environment variables:', missingVars.join(', '))
    console.warn('[Firebase] Analytics will be disabled. Add these to your .env file.')
  }
}

// Only initialize Firebase if required config is present
let app = null
let analytics = null

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  app = initializeApp(firebaseConfig)
  // Initialize Analytics only if supported
  analytics = isSupported().then(yes => yes ? getAnalytics(app) : null)
} else {
  console.warn('[Firebase] Skipping initialization due to missing configuration')
}

export { app, analytics }