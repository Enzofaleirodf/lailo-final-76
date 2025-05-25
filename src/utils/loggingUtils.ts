/**
 * Logging Utilities
 * 
 * This file contains utility functions for logging throughout the application.
 */

import { LogLevel } from '@/constants/errorConstants';

// Define log levels and their priorities
const LOG_LEVEL_PRIORITY = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3
};

// Current log level - can be set based on environment
let currentLogLevel: LogLevel = process.env.NODE_ENV === 'production' 
  ? LogLevel.WARN 
  : LogLevel.DEBUG;

/**
 * Sets the current log level
 * 
 * @param level The log level to set
 */
export const setLogLevel = (level: LogLevel): void => {
  currentLogLevel = level;
};

/**
 * Checks if a log level should be displayed based on the current log level
 * 
 * @param level The log level to check
 * @returns Whether the log level should be displayed
 */
const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLogLevel];
};

/**
 * Formats a log message with timestamp and additional info
 * 
 * @param level The log level
 * @param message The log message
 * @param additionalInfo Additional information to include in the log
 * @returns The formatted log message
 */
const formatLogMessage = (
  level: LogLevel,
  message: string,
  additionalInfo?: Record<string, any>
): string => {
  const timestamp = new Date().toISOString();
  let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (additionalInfo) {
    formattedMessage += `\nAdditional Info: ${JSON.stringify(additionalInfo, null, 2)}`;
  }
  
  return formattedMessage;
};

/**
 * Logs a debug message
 * 
 * @param message The message to log
 * @param additionalInfo Additional information to include in the log
 */
export const logDebug = (message: string, additionalInfo?: Record<string, any>): void => {
  if (!shouldLog(LogLevel.DEBUG)) return;
  
  console.debug(formatLogMessage(LogLevel.DEBUG, message, additionalInfo));
};

/**
 * Logs an info message
 * 
 * @param message The message to log
 * @param additionalInfo Additional information to include in the log
 */
export const logInfo = (message: string, additionalInfo?: Record<string, any>): void => {
  if (!shouldLog(LogLevel.INFO)) return;
  
  console.info(formatLogMessage(LogLevel.INFO, message, additionalInfo));
};

/**
 * Logs a warning message
 * 
 * @param message The message to log
 * @param additionalInfo Additional information to include in the log
 */
export const logWarn = (message: string, additionalInfo?: Record<string, any>): void => {
  if (!shouldLog(LogLevel.WARN)) return;
  
  console.warn(formatLogMessage(LogLevel.WARN, message, additionalInfo));
};

/**
 * Logs an error message
 * 
 * @param message The message to log
 * @param error The error object
 * @param additionalInfo Additional information to include in the log
 */
export const logError = (
  message: string,
  error?: unknown,
  additionalInfo?: Record<string, any>
): void => {
  if (!shouldLog(LogLevel.ERROR)) return;
  
  console.error(formatLogMessage(LogLevel.ERROR, message, additionalInfo));
  
  if (error) {
    console.error(error);
  }
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
  if (!shouldLog(LogLevel.INFO)) return;
  
  console.info(formatLogMessage(LogLevel.INFO, `User Action: ${action}`, details));
  
  // In a production environment, this would send the action to an analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToAnalyticsService(action, details);
  }
};

/**
 * Logs a system event for monitoring and debugging purposes
 * 
 * @param event The event that occurred
 * @param details Details about the event
 */
export const logSystemEvent = (
  event: string,
  details?: Record<string, any>
): void => {
  if (!shouldLog(LogLevel.INFO)) return;
  
  console.info(formatLogMessage(LogLevel.INFO, `System Event: ${event}`, details));
  
  // In a production environment, this would send the event to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToMonitoringService(event, details);
  }
};

/**
 * Logs a performance metric for monitoring and optimization
 * 
 * @param metric The metric name
 * @param value The metric value
 * @param details Additional details about the metric
 */
export const logPerformance = (
  metric: string,
  value: number,
  details?: Record<string, any>
): void => {
  if (!shouldLog(LogLevel.DEBUG)) return;
  
  console.debug(formatLogMessage(LogLevel.DEBUG, `Performance: ${metric} = ${value}ms`, details));
  
  // In a production environment, this would send the metric to a performance monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToPerformanceMonitoringService(metric, value, details);
  }
};