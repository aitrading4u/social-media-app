// Global error handler for unhandled errors
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    console.warn('Unhandled error:', event.error);
    
    // Ignore specific errors that are not critical
    if (event.error?.message?.includes('ethereum')) {
      console.log('Ignoring ethereum-related error');
      return;
    }
    
    if (event.error?.message?.includes('translateDisabled')) {
      console.log('Ignoring translateDisabled error');
      return;
    }
    
    // For other errors, log them but don't crash the app
    console.error('Global error caught:', event.error);
  });

  // Override console.error to filter out non-critical errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Filter out specific errors that are not critical
    if (message.includes('ethereum') || 
        message.includes('translateDisabled') ||
        message.includes('Script error')) {
      console.log('Filtered non-critical error:', message);
      return;
    }
    
    // Call original console.error for other errors
    originalConsoleError.apply(console, args);
  };
};

// Safe wrapper for async operations
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    console.warn('Safe async operation failed:', error);
    return fallback;
  }
};

// Safe wrapper for synchronous operations
export const safeSync = <T>(
  operation: () => T,
  fallback?: T
): T | undefined => {
  try {
    return operation();
  } catch (error) {
    console.warn('Safe sync operation failed:', error);
    return fallback;
  }
}; 