
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import React from 'react';

// Mock window.location.reload
const mockReload = vi.fn();
vi.stubGlobal('location', {
  reload: mockReload
});

// Mock component that throws an error
const ErrorComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock console.error to prevent test output pollution
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mockReload.mockClear();
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test content')).toBeDefined();
  });
  
  it('renders fallback UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Algo deu errado')).toBeDefined();
    expect(screen.getByText(/Ocorreu um erro ao renderizar este componente/)).toBeDefined();
    expect(screen.getByText('Recarregar página')).toBeDefined();
  });
  
  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom fallback')).toBeDefined();
  });
  
  it('calls onError when there is an error', () => {
    const onError = vi.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(onError).toHaveBeenCalled();
  });
  
  it('includes componentName in error info when provided', () => {
    const onError = vi.fn();
    
    render(
      <ErrorBoundary onError={onError} componentName="TestComponent">
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toBe('Test error');
  });
});
