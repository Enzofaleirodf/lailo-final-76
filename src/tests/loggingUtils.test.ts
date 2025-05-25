import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  setLogLevel,
  logDebug,
  logInfo,
  logWarn,
  logError,
  logUserAction,
  logSystemEvent,
  logPerformance
} from '../utils/loggingUtils';
import { LogLevel } from '../constants/errorConstants';

describe('loggingUtils', () => {
  beforeEach(() => {
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Reset log level to DEBUG for testing
    setLogLevel(LogLevel.DEBUG);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('logDebug', () => {
    it('logs debug messages when log level is DEBUG', () => {
      setLogLevel(LogLevel.DEBUG);
      logDebug('Test debug message');
      expect(console.debug).toHaveBeenCalled();
    });
    
    it('does not log debug messages when log level is higher than DEBUG', () => {
      setLogLevel(LogLevel.INFO);
      logDebug('Test debug message');
      expect(console.debug).not.toHaveBeenCalled();
    });
    
    it('includes additional info when provided', () => {
      const additionalInfo = { key: 'value' };
      logDebug('Test debug message', additionalInfo);
      expect(console.debug).toHaveBeenCalledWith(expect.stringContaining(JSON.stringify(additionalInfo)));
    });
  });
  
  describe('logInfo', () => {
    it('logs info messages when log level is INFO or lower', () => {
      setLogLevel(LogLevel.INFO);
      logInfo('Test info message');
      expect(console.info).toHaveBeenCalled();
      
      setLogLevel(LogLevel.DEBUG);
      logInfo('Test info message');
      expect(console.info).toHaveBeenCalled();
    });
    
    it('does not log info messages when log level is higher than INFO', () => {
      setLogLevel(LogLevel.WARN);
      logInfo('Test info message');
      expect(console.info).not.toHaveBeenCalled();
    });
  });
  
  describe('logWarn', () => {
    it('logs warning messages when log level is WARN or lower', () => {
      setLogLevel(LogLevel.WARN);
      logWarn('Test warning message');
      expect(console.warn).toHaveBeenCalled();
      
      setLogLevel(LogLevel.INFO);
      logWarn('Test warning message');
      expect(console.warn).toHaveBeenCalled();
    });
    
    it('does not log warning messages when log level is higher than WARN', () => {
      setLogLevel(LogLevel.ERROR);
      logWarn('Test warning message');
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
  
  describe('logError', () => {
    it('logs error messages at all log levels', () => {
      setLogLevel(LogLevel.ERROR);
      logError('Test error message');
      expect(console.error).toHaveBeenCalled();
      
      setLogLevel(LogLevel.WARN);
      logError('Test error message');
      expect(console.error).toHaveBeenCalled();
      
      setLogLevel(LogLevel.INFO);
      logError('Test error message');
      expect(console.error).toHaveBeenCalled();
      
      setLogLevel(LogLevel.DEBUG);
      logError('Test error message');
      expect(console.error).toHaveBeenCalled();
    });
    
    it('logs the error object when provided', () => {
      const error = new Error('Test error');
      logError('Test error message', error);
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
  
  describe('logUserAction', () => {
    it('logs user actions when log level is INFO or lower', () => {
      setLogLevel(LogLevel.INFO);
      logUserAction('click_button');
      expect(console.info).toHaveBeenCalled();
      
      setLogLevel(LogLevel.DEBUG);
      logUserAction('click_button');
      expect(console.info).toHaveBeenCalled();
    });
    
    it('does not log user actions when log level is higher than INFO', () => {
      setLogLevel(LogLevel.WARN);
      logUserAction('click_button');
      expect(console.info).not.toHaveBeenCalled();
    });
    
    it('includes action details when provided', () => {
      const details = { buttonId: 'submit', page: 'checkout' };
      logUserAction('click_button', details);
      expect(console.info).toHaveBeenCalledWith(expect.stringContaining(JSON.stringify(details)));
    });
  });
  
  describe('logSystemEvent', () => {
    it('logs system events when log level is INFO or lower', () => {
      setLogLevel(LogLevel.INFO);
      logSystemEvent('app_start');
      expect(console.info).toHaveBeenCalled();
      
      setLogLevel(LogLevel.DEBUG);
      logSystemEvent('app_start');
      expect(console.info).toHaveBeenCalled();
    });
    
    it('does not log system events when log level is higher than INFO', () => {
      setLogLevel(LogLevel.WARN);
      logSystemEvent('app_start');
      expect(console.info).not.toHaveBeenCalled();
    });
  });
  
  describe('logPerformance', () => {
    it('logs performance metrics when log level is DEBUG', () => {
      setLogLevel(LogLevel.DEBUG);
      logPerformance('render_time', 100);
      expect(console.debug).toHaveBeenCalled();
    });
    
    it('does not log performance metrics when log level is higher than DEBUG', () => {
      setLogLevel(LogLevel.INFO);
      logPerformance('render_time', 100);
      expect(console.debug).not.toHaveBeenCalled();
    });
    
    it('includes the metric value in the log message', () => {
      logPerformance('render_time', 100);
      expect(console.debug).toHaveBeenCalledWith(expect.stringContaining('render_time = 100ms'));
    });
  });
});