// Global error logging utility for debugging
class ErrorLogger {
  constructor() {
    this.errors = [];
  }

  logError(error, context = '', additionalInfo = {}) {
    const errorObj = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      context,
      additionalInfo,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server'
    };

    this.errors.push(errorObj);
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[DEBUG - ${context}]`, error, additionalInfo);
    } else {
      // In production, we can still log for debugging purposes
      console.error(`[ERROR - ${context}]`, error?.message || error);
    }
    
    // Store in localStorage for later inspection if needed
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('appErrors', JSON.stringify(this.errors.slice(-50))); // Keep last 50 errors
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('appErrors');
    }
  }
}

export const errorLogger = new ErrorLogger();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorLogger.logError(event.error, 'Global Error', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(event.reason, 'Unhandled Promise Rejection', {
      promise: event.promise
    });
  });
}