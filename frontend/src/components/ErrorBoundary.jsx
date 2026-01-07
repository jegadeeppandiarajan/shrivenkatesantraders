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
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                            <p className="font-semibold text-red-800 mb-2">Error:</p>
                            <pre className="text-sm text-red-700 whitespace-pre-wrap">
                                {this.state.error && this.state.error.toString()}
                            </pre>
                        </div>
                        {this.state.errorInfo && (
                            <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mb-4">
                                <p className="font-semibold text-slate-800 mb-2">Component Stack:</p>
                                <pre className="text-xs text-slate-600 whitespace-pre-wrap overflow-auto max-h-64">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
