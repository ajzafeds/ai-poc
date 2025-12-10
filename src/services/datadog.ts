import { datadogRum } from '@datadog/browser-rum'
import { reactPlugin } from '@datadog/browser-rum-react'

// Initialize Datadog RUM
export function initDatadog() {
  try {
    // Check if already initialized
    if (datadogRum.getInitConfiguration()) {
      console.log('Datadog RUM already initialized')
      return
    }

    datadogRum.init({
        applicationId: '127e7f9d-d24f-4a5d-b22d-bb4ca4abcd85',
        clientToken: 'pub4f3dd4f62069a76aafe79b4f16c03d9a',
        site: 'ap1.datadoghq.com',
        service:'prod',
        env: 'test',
        
        // Specify a version number to identify the deployed version of your application in Datadog
        // version: '1.0.0',
        sessionSampleRate:  100,
        sessionReplaySampleRate: 20,
        defaultPrivacyLevel: 'mask-user-input',
        plugins: [reactPlugin({ router: false })],
    })

    // Start session replay
    datadogRum.startSessionReplayRecording()

    // Add a test action to verify it's working
    datadogRum.addAction('app_initialized', {
      service: 'prod',
      env: 'test',
    })

    console.log('Datadog RUM initialized successfully', {
      service: 'prod',
      env: 'test',
      applicationId: '127e7f9d-d24f-4a5d-b22d-bb4ca4abcd85',
      site: 'ap1.datadoghq.com',
    })
  } catch (error) {
    console.error('Failed to initialize Datadog RUM:', error)
  }
}

// Helper function to safely report errors to Datadog
export function reportErrorToDatadog(error: Error, context?: Record<string, string>) {
  try {
    const initConfig = datadogRum.getInitConfiguration()
    if (initConfig) {
      datadogRum.addError(error, context)
      console.log('Error reported to Datadog:', error.message, context)
      return true
    } else {
      console.warn('Datadog not initialized, cannot report error')
      return false
    }
  } catch (err) {
    console.error('Failed to report error to Datadog:', err)
    return false
  }
}

// Export datadogRum for use in other parts of the app
export { datadogRum }

