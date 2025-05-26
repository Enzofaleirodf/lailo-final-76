import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  getLocalStorageItem, 
  getLocalStorageJsonItem,
  setLocalStorageItem, 
  setLocalStorageJsonItem,
  removeLocalStorageItem, 
  clearLocalStorage,
  isLocalStorageAvailable
} from '@/services/localStorageService';

describe('localStorageService', () => {
  const key = 'testKey';
  const value = 'testValue';
  const jsonValue = { name: 'Test', value: 123 };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Restore any mocked functions
    vi.restoreAllMocks();
  });

  it('should set and get an item in localStorage', () => {
    setLocalStorageItem(key, value);
    expect(localStorage.getItem(key)).toBe(value);
    expect(getLocalStorageItem(key)).toBe(value);
  });

  it('should set and get a JSON item in localStorage', () => {
    setLocalStorageJsonItem(key, jsonValue);
    expect(JSON.parse(localStorage.getItem(key) || '')).toEqual(jsonValue);
    expect(getLocalStorageJsonItem(key)).toEqual(jsonValue);
  });

  it('should return null if JSON item is invalid', () => {
    localStorage.setItem(key, 'invalid json');
    expect(getLocalStorageJsonItem(key)).toBeNull();
  });

  it('should return null if item does not exist in localStorage', () => {
    expect(getLocalStorageItem('nonExistentKey')).toBeNull();
    expect(getLocalStorageJsonItem('nonExistentKey')).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    localStorage.setItem(key, value);
    removeLocalStorageItem(key);
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('should clear localStorage', () => {
    localStorage.setItem(key, value);
    localStorage.setItem('anotherKey', 'anotherValue');
    clearLocalStorage();
    expect(localStorage.getItem(key)).toBeNull();
    expect(localStorage.getItem('anotherKey')).toBeNull();
  });

  it('should check if localStorage is available', () => {
    expect(isLocalStorageAvailable()).toBe(true);
  });

  it('should handle errors when localStorage is not available for getLocalStorageItem', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocalStorage = global.localStorage;
    
    // Mock localStorage.getItem to throw an error
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: () => { throw new Error('localStorage not available'); }
      },
      writable: true
    });

    expect(getLocalStorageItem(key)).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  it('should handle errors when localStorage is not available for getLocalStorageJsonItem', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocalStorage = global.localStorage;
    
    // Mock localStorage.getItem to throw an error
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: () => { throw new Error('localStorage not available'); }
      },
      writable: true
    });

    expect(getLocalStorageJsonItem(key)).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  it('should handle errors when localStorage is not available for setLocalStorageItem', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocalStorage = global.localStorage;
    
    // Mock localStorage.setItem to throw an error
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: () => { throw new Error('localStorage not available'); }
      },
      writable: true
    });

    setLocalStorageItem(key, value);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  it('should handle errors when localStorage is not available for setLocalStorageJsonItem', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocalStorage = global.localStorage;
    
    // Mock localStorage.setItem to throw an error
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: () => { throw new Error('localStorage not available'); }
      },
      writable: true
    });

    setLocalStorageJsonItem(key, jsonValue);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  it('should handle errors when localStorage is not available for removeLocalStorageItem', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocalStorage = global.localStorage;
    
    // Mock localStorage.removeItem to throw an error
    Object.defineProperty(global, 'localStorage', {
      value: {
        removeItem: () => { throw new Error('localStorage not available'); }
      },
      writable: true
    });

    removeLocalStorageItem(key);
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  it('should handle errors when localStorage is not available for clearLocalStorage', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalLocalStorage = global.localStorage;
    
    // Mock localStorage.clear to throw an error
    Object.defineProperty(global, 'localStorage', {
      value: {
        clear: () => { throw new Error('localStorage not available'); }
      },
      writable: true
    });

    clearLocalStorage();
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  it('should detect when localStorage is not available', () => {
    const originalLocalStorage = global.localStorage;
    
    // Mock localStorage to throw an error
    Object.defineProperty(global, 'localStorage', {
      value: {
        setItem: () => { throw new Error('localStorage not available'); },
        getItem: () => { throw new Error('localStorage not available'); },
        removeItem: () => { throw new Error('localStorage not available'); }
      },
      writable: true
    });

    expect(isLocalStorageAvailable()).toBe(false);
    
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });
});