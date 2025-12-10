import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initDatadog, reportErrorToDatadog } from './services/datadog'
import { ErrorBoundary } from './components/ErrorBoundary'

// Initialize Datadog RUM before rendering
initDatadog()

// Set up global error handlers to catch unhandled errors
window.addEventListener('error', (event) => {
  console.log('Global error handler caught error:', event.error)
  if (event.error) {
    reportErrorToDatadog(event.error, {
      source: 'global-error-handler',
      type: 'unhandled-error',
    })
  }
})

window.addEventListener('unhandledrejection', (event) => {
  console.log('Global unhandled rejection handler caught error:', event.reason)
  const error = event.reason instanceof Error 
    ? event.reason 
    : new Error(String(event.reason))
  reportErrorToDatadog(error, {
    source: 'global-unhandled-rejection',
    type: 'unhandled-promise-rejection',
  })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
