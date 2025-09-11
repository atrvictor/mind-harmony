import * as React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F0E5]/30 flex items-center justify-center p-6">
          <div className="max-w-xl text-center">
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-4">The page encountered an error. Please refresh. If this persists, share the console error with support.</p>
            {this.state.error && (
              <pre className="text-left text-xs bg-white/60 p-3 rounded overflow-auto">
                {String(this.state.error.message || this.state.error)}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


