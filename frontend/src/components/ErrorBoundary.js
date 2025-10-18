import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button, Text } from '../styles/styledComponents';

const ErrorContainer = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  background: ${theme.colors.danger}10;
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.lg};
`;

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
        <ErrorContainer>
          <Text size="xl" weight="bold" color="danger" display="block" style={{ marginBottom: theme.spacing.md }}>
            Something went wrong
          </Text>
          <Text size="sm" color="secondary" display="block" style={{ marginBottom: theme.spacing.lg }}>
            Please try refreshing the page or contact support if the issue persists.
          </Text>
          <Button 
            onClick={() => window.location.reload()} 
            variant="primary"
          >
            Refresh Page
          </Button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;