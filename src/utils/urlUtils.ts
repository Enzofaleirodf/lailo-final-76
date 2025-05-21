
/**
 * @fileoverview Utilitários para manipulação de URLs e sincronização com o estado dos filtros
 * Arquivo central que exporta todas as funções relacionadas à manipulação de URL
 */

// Exportar todas as funções dos novos módulos
export { hasFilterChanged, updateUrlParams } from './urlParamsHandler';
export { loadFiltersFromUrl } from './urlParamsLoader';
export { isValidFormat, isValidOrigin, isValidPlace, validateNumericRange } from './urlParamsValidator';
export type { ValidFormat, ValidOrigin, ValidPlace } from './urlParamsValidator';
