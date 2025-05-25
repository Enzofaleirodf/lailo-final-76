import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  logError, 
  getErrorType, 
  getUserFriendlyErrorMessage, 
  createError, 
  handleError 
} from '../utils/errorUtils';
import { ErrorType, ERROR_MESSAGES, CONTENT_TYPE_ERROR_MESSAGES } from '../constants/errorConstants';

describe('errorUtils', () => {
  beforeEach(() => {
    // Mock console.error to prevent test output pollution
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('logError', () => {
    it('logs error to console with source', () => {
      const error = new Error('Test error');
      const source = 'TestComponent';
      
      logError(error, source);
      
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error in TestComponent:'));
      expect(console.error).toHaveBeenCalledWith(error);
    });
    
    it('logs additional info when provided', () => {
      const error = new Error('Test error');
      const source = 'TestComponent';
      const additionalInfo = { userId: '123', action: 'test' };
      
      logError(error, source, additionalInfo);
      
      expect(console.error).toHaveBeenCalledTimes(3);
      expect(console.error).toHaveBeenCalledWith('Additional information:', additionalInfo);
    });
  });
  
  describe('getErrorType', () => {
    it('returns NETWORK for network errors', () => {
      expect(getErrorType(new Error('network error'))).toBe(ErrorType.NETWORK);
      expect(getErrorType(new Error('connection failed'))).toBe(ErrorType.NETWORK);
    });
    
    it('returns TIMEOUT for timeout errors', () => {
      expect(getErrorType(new Error('request timeout'))).toBe(ErrorType.TIMEOUT);
    });
    
    it('returns VALIDATION for validation errors', () => {
      expect(getErrorType(new Error('validation failed'))).toBe(ErrorType.VALIDATION);
      expect(getErrorType(new Error('invalid input'))).toBe(ErrorType.VALIDATION);
    });
    
    it('returns AUTHENTICATION for authentication errors', () => {
      expect(getErrorType(new Error('authentication failed'))).toBe(ErrorType.AUTHENTICATION);
      expect(getErrorType(new Error('login required'))).toBe(ErrorType.AUTHENTICATION);
    });
    
    it('returns AUTHORIZATION for authorization errors', () => {
      expect(getErrorType(new Error('permission denied'))).toBe(ErrorType.AUTHORIZATION);
      expect(getErrorType(new Error('unauthorized access'))).toBe(ErrorType.AUTHORIZATION);
    });
    
    it('returns NOT_FOUND for not found errors', () => {
      expect(getErrorType(new Error('resource not found'))).toBe(ErrorType.NOT_FOUND);
      expect(getErrorType(new Error('404 error'))).toBe(ErrorType.NOT_FOUND);
    });
    
    it('returns SERVER for server errors', () => {
      expect(getErrorType(new Error('server error'))).toBe(ErrorType.SERVER);
    });
    
    it('returns UNKNOWN for unknown errors', () => {
      expect(getErrorType(new Error('some other error'))).toBe(ErrorType.UNKNOWN);
      expect(getErrorType(null)).toBe(ErrorType.UNKNOWN);
    });
  });
  
  describe('getUserFriendlyErrorMessage', () => {
    it('returns content-specific error message when contentType is provided', () => {
      expect(getUserFriendlyErrorMessage(new Error('test'), 'property'))
        .toBe(CONTENT_TYPE_ERROR_MESSAGES.property);
      
      expect(getUserFriendlyErrorMessage(new Error('test'), 'vehicle'))
        .toBe(CONTENT_TYPE_ERROR_MESSAGES.vehicle);
    });
    
    it('returns error type-specific message when contentType is not provided', () => {
      expect(getUserFriendlyErrorMessage(new Error('network error')))
        .toBe(ERROR_MESSAGES[ErrorType.NETWORK]);
      
      expect(getUserFriendlyErrorMessage(new Error('timeout')))
        .toBe(ERROR_MESSAGES[ErrorType.TIMEOUT]);
    });
  });
  
  describe('createError', () => {
    it('creates an error with the specified message', () => {
      const error = createError('Test message');
      expect(error.message).toBe('Test message');
    });
    
    it('adds type to the error when specified', () => {
      const error = createError('Test message', ErrorType.NETWORK);
      expect((error as any).type).toBe(ErrorType.NETWORK);
    });
    
    it('adds originalError to the error when provided', () => {
      const originalError = new Error('Original error');
      const error = createError('Test message', ErrorType.NETWORK, originalError);
      expect((error as any).originalError).toBe(originalError);
    });
  });
  
  describe('handleError', () => {
    it('logs the error and returns a user-friendly message', () => {
      const error = new Error('network error');
      const result = handleError(error, 'TestComponent');
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe(ERROR_MESSAGES[ErrorType.NETWORK]);
    });
    
    it('includes contentType in the user-friendly message when provided', () => {
      const error = new Error('test');
      const result = handleError(error, 'TestComponent', 'property');
      
      expect(result).toBe(CONTENT_TYPE_ERROR_MESSAGES.property);
    });
    
    it('includes additionalInfo in the log when provided', () => {
      const error = new Error('test');
      const additionalInfo = { userId: '123', action: 'test' };
      handleError(error, 'TestComponent', undefined, additionalInfo);
      
      expect(console.error).toHaveBeenCalledWith('Additional information:', additionalInfo);
    });
  });
});