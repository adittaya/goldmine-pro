import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Simple test component
function TestApp() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Test App Loaded Successfully!</h1>
      <p>If you see this, React is working.</p>
    </div>
  );
}

// Try rendering without any complex components
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <Router>
          <TestApp />
        </Router>
      </StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Error rendering app:', error);
  // Fallback: create content directly
  document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>Error initializing app</h1><p>Please check console for details.</p></div>';
}