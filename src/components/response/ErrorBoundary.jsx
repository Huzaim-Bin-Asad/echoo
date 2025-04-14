import React, { Component } from "react";
import ErrorCard from "./error";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error("Error caught in ErrorBoundary:", error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error info:", errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload(); // or navigate programmatically if using react-router
  };

  render() {
    if (this.state.hasError) {
      return <ErrorCard onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
