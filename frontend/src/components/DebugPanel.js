// DebugPanel.jsx - Updated to use premium UI components
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button, Text } from '../styles/styledComponents';

const DebugPanelContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: white;
  border: 1px solid ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.lg};
  max-width: 300px;
`;

const DebugPanel = () => {
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <DebugPanelContainer>
      <Button 
        onClick={() => setShowDebug(!showDebug)} 
        size="sm"
        variant="secondary"
        style={{ marginBottom: theme.spacing.md }}
      >
        {showDebug ? 'Hide Debug' : 'Show Debug'}
      </Button>
      
      {showDebug && (
        <div>
          <Text size="sm" weight="semibold">Debug Info</Text>
          <Text size="xs" color="secondary" display="block">
            Environment: {process.env.NODE_ENV}
          </Text>
        </div>
      )}
    </DebugPanelContainer>
  );
};

export default DebugPanel;