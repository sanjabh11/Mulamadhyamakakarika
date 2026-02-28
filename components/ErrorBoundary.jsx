"use client";

import React from 'react';

/**
 * ErrorBoundary - Catches JavaScript errors in child component tree
 * Critical for 3D animations that may crash due to WebGL issues
 * 
 * @fix H5 - No React error boundaries
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    // Log to analytics (replace with your analytics provider)
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('Error Caught', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    }

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI for 3D animation errors
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          padding: '2rem',
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          color: '#e2e8f0',
          textAlign: 'center'
        }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            style={{ marginBottom: '1rem' }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>

          <h3 style={{ margin: '0 0 0.5rem', color: '#8B5CF6' }}>
            Visualization Temporarily Unavailable
          </h3>

          <p style={{ margin: '0 0 1rem', color: '#94a3b8', maxWidth: '400px' }}>
            The 3D animation encountered an issue. This may be due to browser
            compatibility or WebGL limitations.
          </p>

          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#8B5CF6'}
          >
            Try Again
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '1rem', textAlign: 'left', width: '100%' }}>
              <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>
                Error Details (Dev Only)
              </summary>
              <pre style={{
                fontSize: '0.75rem',
                overflow: 'auto',
                backgroundColor: '#0f172a',
                padding: '1rem',
                borderRadius: '4px',
                marginTop: '0.5rem'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
