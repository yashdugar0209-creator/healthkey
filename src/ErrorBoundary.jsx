// src/ErrorBoundary.jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    // Optionally log the error to console or remote service
    console.error('Captured error in ErrorBoundary:', error, info);
  }
  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {String(error && (error.stack || error.message || error))}
          </pre>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {info && info.componentStack}
          </details>
          <p>Open DevTools → Console for full stack trace (source maps may point to original files).</p>
        </div>
      );
    }
    return this.props.children;
  }
}
