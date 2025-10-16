import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Function to handle errors during rendering
const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = createRoot(rootElement);
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    } catch (error) {
      console.error('Error rendering app:', error);
      rootElement.innerHTML = '<div style="padding: 20px; text-align: center; color: #f00;">Application failed to load. Please refresh the page or contact support.</div>';
    }
  } else {
    console.error('Failed to find the root element');
  }
};

// Render the app
renderApp();
