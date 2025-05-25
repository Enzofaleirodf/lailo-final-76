/**
 * Error Utilities
 * 
 * This file contains utility functions for error handling throughout the application.
 */

import { ErrorType, ERROR_MESSAGES, CONTENT_TYPE_ERROR_MESSAGES, LogLevel } from '@/constants/errorConstants';

/**
 * Logs an error to the console with additional information
 * for easier debugging
 * 
 * @param error The error object
 * @param source The source of the error (e.g., component name, function name)
 * @param additionalInfo Additional information about the error context
 */
export const logError = (
  error: unknown, 
  source: string,
  additionalInfo?: Record<string, any>
): void => {
  // Format error message for console
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error in ${source}:`);
  console.error(error);
  
  // Include additional information if provided
  if (additionalInfo) {
    console.error('Additional information:', additionalInfo);
  }
  
  // In a production environment, we might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTrackingService(error, source, additionalInfo);
  }
};

/**
 * Determines the type of error based on the error message or object
 * 
 * @param error The error object or message
 * @returns The error type
 */
export const getErrorType = (error: unknown): ErrorType => {
  if (!error) return ErrorType.UNKNOWN;
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return ErrorType.NETWORK;
  }
  
  if (errorMessage.includes('timeout')) {
    return ErrorType.TIMEOUT;
  }
  
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return ErrorType.VALIDATION;
  }
  
  if (errorMessage.includes('authentication') || errorMessage.includes('login')) {
    return ErrorType.AUTHENTICATION;
  }
  
  if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
    return ErrorType.AUTHORIZATION;
  }
  
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return ErrorType.NOT_FOUND;
  }
  
  if (errorMessage.includes('server')) {
    return ErrorType.SERVER;
  }
  
  return ErrorType.UNKNOWN;
};

/**
 * Generates a user-friendly error message based on the error type
 * 
 * @param error The error object or message
 * @param contentType The type of content being accessed (e.g., 'property', 'vehicle')
 * @returns A user-friendly error message
 */
export const getUserFriendlyErrorMessage = (
  error: unknown,
  contentType?: string
): string => {
  const errorType = getErrorType(error);
  
  // If content type is provided, use content-specific error message
  if (contentType && (contentType === 'property' || contentType === 'vehicle')) {
    return CONTENT_TYPE_ERROR_MESSAGES[contentType as keyof typeof CONTENT_TYPE_ERROR_MESSAGES];
  }
  
  // Otherwise, use generic error message based on error type
  return ERROR_MESSAGES[errorType];
};

/**
 * Creates a standardized error object
 * 
 * @param message The error message
 * @param type The error type
 * @param originalError The original error object
 * @returns A standardized error object
 */
export const createError = (
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  originalError?: unknown
): Error => {
  const error = new Error(message);
  (error as any).type = type;
  (error as any).originalError = originalError;
  return error;
};

/**
 * Handles an error by logging it and returning a user-friendly message
 * 
 * @param error The error object
 * @param source The source of the error
 * @param contentType The type of content being accessed
 * @param additionalInfo Additional information about the error context
 * @returns A user-friendly error message
 */
export const handleError = (
  error: unknown,
  source: string,
  contentType?: string,
  additionalInfo?: Record<string, any>
): string => {
  // Log the error
  logError(error, source, additionalInfo);
  
  // Return a user-friendly error message
  return getUserFriendlyErrorMessage(error, contentType);
};