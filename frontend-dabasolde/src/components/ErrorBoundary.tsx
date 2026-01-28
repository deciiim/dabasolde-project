import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        padding: '20px',
                        textAlign: 'center',
                        background: 'var(--bg-main)',
                        color: 'var(--text-main)',
                    }}
                >
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</h1>
                    <h2 style={{ marginBottom: '1rem' }}>Oops! Something went wrong</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '12px 24px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                        }}
                    >
                        Return to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
