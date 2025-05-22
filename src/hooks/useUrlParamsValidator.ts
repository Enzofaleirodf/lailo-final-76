
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validateNumericRange } from '@/utils/urlUtils';

/**
 * Valida e corrige parâmetros de URL inválidos
 * Versão atualizada para usar o arquivo unificado de utilidades de URL
 */
export const useUrlParamsValidator = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Validação e correção de parâmetros de URL inválidos
  useEffect(() => {
    const invalidParams: string[] = [];
    const newParams = new URLSearchParams(searchParams);
    let hasChanges = false;

    // Validar intervalos numéricos para anos
    const yearResult = validateNumericRange(
      searchParams.get('yearMin'),
      searchParams.get('yearMax'),
      '',
      ''
    );
    
    if (!yearResult.isValid) {
      invalidParams.push(`year (${searchParams.get('yearMin')}-${searchParams.get('yearMax')})`);
      if (yearResult.minValue) newParams.set('yearMin', yearResult.minValue);
      if (yearResult.maxValue) newParams.set('yearMax', yearResult.maxValue);
      hasChanges = true;
    }
    
    // Validar preços
    const priceResult = validateNumericRange(
      searchParams.get('priceMin'),
      searchParams.get('priceMax'),
      '',
      ''
    );
    
    if (!priceResult.isValid) {
      invalidParams.push(`price (${searchParams.get('priceMin')}-${searchParams.get('priceMax')})`);
      if (priceResult.minValue) newParams.set('priceMin', priceResult.minValue);
      if (priceResult.maxValue) newParams.set('priceMax', priceResult.maxValue);
      hasChanges = true;
    }
    
    // Validar área útil
    const areaResult = validateNumericRange(
      searchParams.get('usefulAreaMin'),
      searchParams.get('usefulAreaMax'),
      '',
      ''
    );
    
    if (!areaResult.isValid) {
      invalidParams.push(`usefulArea (${searchParams.get('usefulAreaMin')}-${searchParams.get('usefulAreaMax')})`);
      if (areaResult.minValue) newParams.set('usefulAreaMin', areaResult.minValue);
      if (areaResult.maxValue) newParams.set('usefulAreaMax', areaResult.maxValue);
      hasChanges = true;
    }
    
    // Validar tipo de conteúdo
    const contentType = searchParams.get('contentType');
    if (contentType !== null && contentType !== 'property' && contentType !== 'vehicle') {
      invalidParams.push(`contentType (${contentType})`);
      newParams.set('contentType', 'property');
      hasChanges = true;
    }

    // Validar formato de leilão
    const format = searchParams.get('format');
    if (format !== null && !['Todos', 'Alienação Particular', 'Leilão', 'Venda Direta'].includes(format)) {
      invalidParams.push(`format (${format})`);
      newParams.set('format', 'Todos');
      hasChanges = true;
    }

    // Se houver parâmetros inválidos, corrigir os parâmetros silenciosamente (sem toast)
    if (hasChanges) {
      // Atualizar URL com parâmetros corrigidos
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
};
