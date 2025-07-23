import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-violet-200 mb-6">
              The application encountered an error. Please try refreshing the page.
            </p>
            
            {this.state.error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
                <h2 className="text-red-300 font-semibold mb-2">Error Details:</h2>
                <pre className="text-red-200 text-sm overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
            
            {this.state.errorInfo && (
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                <h2 className="text-blue-300 font-semibold mb-2">Component Stack:</h2>
                <pre className="text-blue-200 text-sm overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 