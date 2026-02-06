/**
 * Error Handling Utilities
 * Provides consistent error classification and user-friendly messages
 */

export type ErrorType = 'validation' | 'network' | 'auth' | 'file' | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
  retryable: boolean;
}

/**
 * Classify and format errors for user display
 */
export const classifyError = (error: any): ErrorInfo => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'network',
      message: 'Network connection error. Please check your internet connection.',
      originalError: error,
      retryable: true,
    };
  }

  if (error instanceof Error) {
    if (error.message.includes('Invalid file')) {
      return {
        type: 'file',
        message: error.message || 'File upload failed. Please check the file type and size.',
        originalError: error,
        retryable: true,
      };
    }

    if (error.message.includes('Unauthorized') || error.message.includes('401')) {
      return {
        type: 'auth',
        message: 'Authentication failed. Please log in again.',
        originalError: error,
        retryable: false,
      };
    }

    if (error.message.includes('Validation')) {
      return {
        type: 'validation',
        message: error.message,
        originalError: error,
        retryable: false,
      };
    }

    return {
      type: 'unknown',
      message: error.message || 'An unexpected error occurred.',
      originalError: error,
      retryable: true,
    };
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error,
    retryable: true,
  };
};

/**
 * Safe async wrapper with error handling
 */
export const safeAsync = async <T,>(
  fn: () => Promise<T>,
  errorHandler?: (error: ErrorInfo) => void,
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    const errorInfo = classifyError(error);
    if (errorHandler) {
      errorHandler(errorInfo);
    }
    console.error('Error:', errorInfo);
    return null;
  }
};

/**
 * Retry logic for failed operations
 */
export const retryAsync = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T | null> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
  return null;
};

/**
 * Format validation errors
 */
export const formatValidationErrors = (errors: Record<string, string>): string => {
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join('\n');
};

/**
 * Log error for debugging (can be sent to monitoring service)
 */
export const logError = (error: ErrorInfo, context?: Record<string, any>) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type: error.type,
    message: error.message,
    retryable: error.retryable,
    context,
  };

  console.error('Error Log:', logEntry);

  // In production, send to error tracking service (e.g., Sentry, LogRocket)
  // Example: sentryClient.captureException(error.originalError, { extra: context });
};
