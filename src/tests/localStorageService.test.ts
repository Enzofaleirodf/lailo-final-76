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

  // Mock localStorage
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', mockLocalStorage);
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should set and get an item in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(value);
    setLocalStorageItem(key, value);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(key, value);
    expect(getLocalStorageItem(key)).toBe(value);
  });

  it('should set and get a JSON item in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(jsonValue));
    setLocalStorageJsonItem(key, jsonValue);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(jsonValue));
    expect(getLocalStorageJsonItem(key)).toEqual(jsonValue);
  });

  it('should return null if JSON item is invalid', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    expect(getLocalStorageJsonItem(key)).toBeNull();
  });

  it('should return null if item does not exist in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    expect(getLocalStorageItem('nonExistentKey')).toBeNull();
    expect(getLocalStorageJsonItem('nonExistentKey')).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    removeLocalStorageItem(key);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(key);
  });

  it('should clear localStorage', () => {
    clearLocalStorage();
    expect(mockLocalStorage.clear).toHaveBeenCalled();
  });

  it('should check if localStorage is available', () => {
    expect(isLocalStorageAvailable()).toBe(true);
  });

  it('should handle errors when localStorage is not available for clearLocalStorage', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLocalStorage.clear.mockImplementation(() => {
      throw new Error('localStorage not available');
    });

    clearLocalStorage();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should detect when localStorage is not available', () => {
    vi.unstubAllGlobals();
    vi.stubGlobal('localStorage', {
      setItem: () => { throw new Error('localStorage not available'); },
      getItem: () => { throw new Error('localStorage not available'); },
      removeItem: () => { throw new Error('localStorage not available'); }
    });

    expect(isLocalStorageAvailable()).toBe(false);
  });
});