import React, { useState, useEffect } from 'react';
import { errorLogger } from '../utils/errorLogger';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Load errors from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedErrors = localStorage.getItem('appErrors');
        if (storedErrors) {
          setErrors(JSON.parse(storedErrors));
        }
      } catch (e) {
        // Ignore errors when loading from localStorage
      }
    }
  }, []);

  useEffect(() => {
    // Listen to error logger changes
    const updateErrors = () => {
      setErrors([...errorLogger.getErrors()]);
    };

    // Update errors periodically
    const interval = setInterval(updateErrors, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 10000,
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        title="Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 10000,
      width: '400px',
      maxHeight: '500px',
      background: 'white',
      border: '2px solid #ccc',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontSize: '12px',
      overflow: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #eee',
        paddingBottom: '5px'
      }}>
        <h4 style={{ margin: 0 }}>Debug Panel</h4>
        <div>
          <button 
            onClick={() => {
              errorLogger.clearErrors();
              setErrors([]);
            }}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '10px',
              marginRight: '5px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
      
      <div>
        <p><strong>Total Errors:</strong> {errors.length}</p>
        {errors.length > 0 ? (
          <div>
            {errors.slice(-10).reverse().map((error, index) => (
              <div key={index} style={{
                padding: '8px',
                margin: '5px 0',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '11px'
              }}>
                <div><strong>Time:</strong> {new Date(error.timestamp).toLocaleTimeString()}</div>
                <div><strong>Context:</strong> {error.context}</div>
                <div><strong>Error:</strong> {error.error}</div>
                {error.additionalInfo && Object.keys(error.additionalInfo).length > 0 && (
                  <details style={{ fontSize: '10px', marginTop: '4px' }}>
                    <summary>Additional Info</summary>
                    <pre>{JSON.stringify(error.additionalInfo, null, 2)}</pre>
                  </details>
                )}
                {error.stack && (
                  <details style={{ fontSize: '10px', marginTop: '4px' }}>
                    <summary>Stack Trace</summary>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No errors logged</p>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;