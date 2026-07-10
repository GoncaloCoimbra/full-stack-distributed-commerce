import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="text-center max-w-md">
            <h2 className="text-3xl font-bold mb-2 text-red-400">Application Error</h2>
            <p className="mb-4 text-slate-300">An unexpected error occurred. Please try reloading the page or contact support if the issue persists.</p>
            <div className="bg-slate-800/50 border border-red-500/30 rounded p-3 mb-6 text-sm text-left text-slate-400">
              <p className="font-mono text-xs break-words">{this.state.error?.message}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium transition-all"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-all"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;