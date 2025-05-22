
import '@testing-library/jest-dom';

// Valores padrão para tamanho de janela em testes
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 768
});

// Mock para eventos de disparo
window.dispatchEvent = jest.fn();

// Remover avisos de atos que não afetam os testes
console.warn = jest.fn();

// Mock de funções de timer para testes síncronos
jest.useFakeTimers();
