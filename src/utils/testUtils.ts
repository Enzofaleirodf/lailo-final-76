
import { ContentType } from '@/types/filters';
import { defaultRangeValues } from '@/stores/useFilterStore';

/**
 * Funções e constantes auxiliares para testes
 */

// Adicionar o contentType aos componentes de teste que não têm esta propriedade
export const mockContentType: ContentType = 'vehicle';

// Valores padrão para filtros de intervalo usados nos testes
export const testDefaultRangeValues = defaultRangeValues;

// Mock para funções de filtragem
export const mockFilterFunction = jest.fn();
