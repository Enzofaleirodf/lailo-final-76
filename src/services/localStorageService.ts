/**
 * Local Storage Service
 * 
 * This file contains utility functions for interacting with localStorage
 * in a safe and consistent manner throughout the application.
 */

/**
 * Retrieves an item from localStorage
 * 
 * @param key The key to retrieve
 * @returns The value from localStorage, or null if not found or an error occurs
 */
export const getLocalStorageItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return null;
  }
};

/**
 * Retrieves and parses a JSON item from localStorage
 * 
 * @param key The key to retrieve
 * @returns The parsed value from localStorage, or null if not found, invalid JSON, or an error occurs
 */
export const getLocalStorageJsonItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error getting and parsing JSON item from localStorage:', error);
    return null;
  }
};

/**
 * Sets an item in localStorage
 * 
 * @param key The key to set
 * @param value The value to set
 */
export const setLocalStorageItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting item in localStorage:', error);
  }
};

/**
 * Sets a JSON item in localStorage
 * 
 * @param key The key to set
 * @param value The value to set (will be stringified)
 */
export const setLocalStorageJsonItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting JSON item in localStorage:', error);
  }
};

/**
 * Removes an item from localStorage
 * 
 * @param key The key to remove
 */
export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};

/**
 * Clears all items from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Checks if localStorage is available
 * 
 * @returns Whether localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    const result = localStorage.getItem(testKey) === testKey;
    localStorage.removeItem(testKey);
    return result;
  } catch (error) {
    return false;
  }
};