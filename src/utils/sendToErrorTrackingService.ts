/**
 * Error Tracking Service
 * 
 * This file contains the implementation of the error tracking service.
 * In a production environment, this would send errors to a service like Sentry, LogRocket, etc.
 */

import { ErrorType, LogLevel } from '@/constants/errorConstants';

interface ErrorTrackingOptions {
  tags?: Record<string, string>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  level?: LogLevel;
  fingerprint?: string[];
}

/**
 * Sends an error to the error tracking service
 * 
 * @param error The error object
 * @param source The source of the error (e.g., component name, function name)
 * @param additionalInfo Additional information about the error context
 * @param options Options for the error tracking service
 */
export const sendToErrorTrackingService = (
  error: unknown,
  source: string,
  additionalInfo?: Record<string, any>,
  options?: ErrorTrackingOptions
): void => {
  // In development, just log to console
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error Tracking] Error in ${source}:`, error);
    if (additionalInfo) {
      console.error('[Error Tracking] Additional info:', additionalInfo);
    }
    if (options) {
      console.error('[Error Tracking] Options:', options);
    }
    return;
  }

  // In production, this would send the error to a service like Sentry
  try {
    // Create the error payload
    const errorPayload = {
      error: error instanceof Error ? error : new Error(String(error)),
      source,
      additionalInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...options
    };

    // This is where you would send the error to your error tracking service
    // For example, with Sentry:
    // Sentry.captureException(errorPayload.error, {
    //   tags: { source },
    //   extra: { ...additionalInfo },
    //   level: options?.level || 'error',
    //   fingerprint: options?.fingerprint,
    //   user: options?.user
    // });

    // For now, we'll just store it in localStorage for demonstration
    const errorLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
    errorLogs.push(errorPayload);
    
    // Limit the number of stored errors to prevent localStorage from filling up
    if (errorLogs.length > 50) {
      errorLogs.shift(); // Remove the oldest error
    }
    
    localStorage.setItem('error_logs', JSON.stringify(errorLogs));

    // You could also send the error to your own API endpoint
    // fetch('/api/error-logging', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorPayload)
    // }).catch(e => console.error('Failed to send error to API:', e));
  } catch (e) {
    // If error tracking fails, log to console as a fallback
    console.error('Error tracking failed:', e);
    console.error('Original error:', error);
  }
};

/**
 * Initializes the error tracking service
 * 
 * @param options Options for initializing the error tracking service
 */
export const initErrorTracking = (options?: {
  dsn?: string;
  environment?: string;
  release?: string;
}): void => {
  // In a real implementation, this would initialize your error tracking service
  // For example, with Sentry:
  // Sentry.init({
  //   dsn: options?.dsn || process.env.SENTRY_DSN,
  //   environment: options?.environment || process.env.NODE_ENV,
  //   release: options?.release || process.env.APP_VERSION,
  //   tracesSampleRate: 1.0,
  // });

  // Set up global error handlers
  window.addEventListener('error', (event) => {
    sendToErrorTrackingService(
      event.error || new Error(event.message),
      'window.onerror',
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    sendToErrorTrackingService(
      event.reason,
      'unhandledrejection',
      {
        promise: event.promise
      }
    );
  });

  console.log('Error tracking initialized');
};

/**
 * Logs a user action for analytics and debugging purposes
 * 
 * @param action The action performed
 * @param details Details about the action
 */
export const logUserAction = (
  action: string,
  details?: Record<string, any>
): void => {
  // In a real implementation, this would log user actions to your analytics service
  // For example, with Sentry:
  // Sentry.addBreadcrumb({
  //   category: 'user',
  //   message: action,
  //   data: details,
  //   level: 'info'
  // });

  // For now, we'll just log to console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[User Action] ${action}`, details);
  }
};