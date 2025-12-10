import React, { Component, ErrorInfo, ReactNode } from 'react'
import { datadogRum } from '../services/datadog'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report error to Datadog
    console.log('ErrorBoundary caught error, reporting to Datadog:', error)
    
    // Check if Datadog is initialized
    const initConfig = datadogRum.getInitConfiguration()
    if (initConfig) {
      datadogRum.addError(error, {
        source: 'react-error-boundary',
        errorInfo: errorInfo.componentStack,
      })
      console.log('Error reported to Datadog')
    } else {
      console.warn('Datadog not initialized, cannot report error')
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}


