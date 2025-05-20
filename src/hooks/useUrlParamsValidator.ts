
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState, ContentType } from '@/types/filters';
import { useToast } from './use-toast';

/**
 * Valida e corrige parâmetros de URL inválidos
 */
export const useUrlParamsValidator = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // Validação e correção de parâmetros de URL inválidos
  useEffect(() => {
    const invalidParams: string[] = [];
    const newParams = new URLSearchParams(searchParams);
    let hasChanges = false;

    // Validar intervalos numéricos
    const validateNumericRange = (
      minParam: string, 
      maxParam: string, 
      minDefault: string, 
      maxDefault: string
    ) => {
      const min = searchParams.get(minParam);
      const max = searchParams.get(maxParam);
      
      // Verificar se os valores são numéricos
      if (min !== null && isNaN(Number(min))) {
        invalidParams.push(`${minParam} (${min})`);
        newParams.set(minParam, minDefault);
        hasChanges = true;
      }
      
      if (max !== null && isNaN(Number(max))) {
        invalidParams.push(`${maxParam} (${max})`);
        newParams.set(maxParam, maxDefault);
        hasChanges = true;
      }
      
      // Verificar se min > max
      if (min !== null && max !== null && Number(min) > Number(max)) {
        invalidParams.push(`${minParam}-${maxParam} (${min}-${max})`);
        newParams.set(minParam, minDefault);
        newParams.set(maxParam, maxDefault);
        hasChanges = true;
      }
    };

    // Validar anos
    validateNumericRange('yearMin', 'yearMax', '', '');
    
    // Validar preços
    validateNumericRange('priceMin', 'priceMax', '', '');
    
    // Validar área útil
    validateNumericRange('usefulAreaMin', 'usefulAreaMax', '', '');
    
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

    // Se houver parâmetros inválidos, exibir toast e corrigir os parâmetros
    if (hasChanges) {
      toast({
        title: 'Parâmetros inválidos detectados',
        description: `Os seguintes parâmetros foram corrigidos: ${invalidParams.join(', ')}`,
        variant: 'destructive',
        duration: 5000
      });
      
      // Atualizar URL com parâmetros corrigidos
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);
};
