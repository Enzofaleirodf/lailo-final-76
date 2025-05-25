/**
 * Error Constants
 * 
 * This file contains all the constants related to error handling used throughout the application.
 * Centralizing these values helps maintain consistency and makes it easier to update
 * the error messages in the future.
 */

// Error types
export enum ErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

// Error messages
export const ERROR_MESSAGES = {
  [ErrorType.NETWORK]: 'Erro de conexão. Verifique sua internet e tente novamente.',
  [ErrorType.TIMEOUT]: 'A operação demorou muito para responder. Tente novamente mais tarde.',
  [ErrorType.VALIDATION]: 'Dados inválidos. Verifique os campos e tente novamente.',
  [ErrorType.AUTHENTICATION]: 'Erro de autenticação. Faça login novamente.',
  [ErrorType.AUTHORIZATION]: 'Você não tem permissão para acessar este recurso.',
  [ErrorType.NOT_FOUND]: 'O recurso solicitado não foi encontrado.',
  [ErrorType.SERVER]: 'Erro no servidor. Tente novamente mais tarde.',
  [ErrorType.UNKNOWN]: 'Ocorreu um erro desconhecido. Tente novamente.',
};

// Content type specific error messages
export const CONTENT_TYPE_ERROR_MESSAGES = {
  property: 'Ocorreu um erro ao carregar os imóveis. Tente novamente.',
  vehicle: 'Ocorreu um erro ao carregar os leilões. Tente novamente.',
};

// Error logging levels
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

// Error logging format
export interface ErrorLog {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  error?: unknown;
  additionalInfo?: Record<string, any>;
}

// Maximum number of errors to store in local storage
export const MAX_ERROR_LOGS = 50;

// Local storage key for error logs
export const ERROR_LOGS_STORAGE_KEY = 'error_logs';