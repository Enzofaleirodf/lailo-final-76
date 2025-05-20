
// Define types for @testing-library/jest-dom
/// <reference types="@testing-library/jest-dom" />

// Define tipos para mocks em testes
declare namespace jest {
  interface MockInstance<T, Y extends any[]> {
    new (...args: Y): T;
    (...args: Y): T;
  }
}
