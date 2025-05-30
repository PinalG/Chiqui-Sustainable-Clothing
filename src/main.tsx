
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import monitoring from './lib/monitoring';

// Initialize error monitoring as early as possible
monitoring.init();

// Report initial load time safely
if (window.performance && window.performance.timing) {
  // We'll let the monitoring service handle this properly at load time
  // instead of calculating potentially invalid metrics here
  console.log('Monitoring initialized with performance API available');
}

// Add error boundary for the entire application
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    monitoring.captureError(error, 'critical', { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-soft-pink">Something went wrong</h1>
            <p className="mb-6 text-gray-600">
              We're sorry, but the application has encountered an unexpected error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-soft-pink text-white rounded-md hover:bg-soft-pink/90 transition-colors"
            >
              Reload the application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Render the app with ErrorBoundary
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
