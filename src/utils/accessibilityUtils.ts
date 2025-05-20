
/**
 * Utilitários para melhorar a acessibilidade dos componentes
 */

/**
 * Gera uma descrição detalhada para campos de intervalo numéricos
 */
export const generateRangeDescription = (
  baseDescription: string,
  minAllowed?: number,
  maxAllowed?: number,
  allowDecimals = false,
  allowNegative = false
): string => {
  let desc = baseDescription;
  
  if (minAllowed !== undefined && maxAllowed !== undefined) {
    desc += `. Valores permitidos: de ${minAllowed} a ${maxAllowed}`;
  } else if (minAllowed !== undefined) {
    desc += `. Valor mínimo permitido: ${minAllowed}`;
  } else if (maxAllowed !== undefined) {
    desc += `. Valor máximo permitido: ${maxAllowed}`;
  }
  
  if (allowDecimals) {
    desc += `. Valores decimais são permitidos`;
  } else {
    desc += `. Apenas números inteiros`;
  }
  
  if (allowNegative) {
    desc += `. Valores negativos são permitidos`;
  }
  
  return desc;
};

/**
 * Anuncia mudanças de valor para leitores de tela
 */
export const announceValueChange = (type: string, value: string, fieldName: string): void => {
  const liveRegion = document.getElementById('filter-range-live-region');
  if (liveRegion) {
    liveRegion.textContent = `${fieldName} ${type} alterado para ${value}`;
  }
};

/**
 * Configura uma região "live" para anúncios de acessibilidade
 */
export const setupLiveRegion = (fieldName: string): () => void => {
  if (!document.getElementById('filter-range-live-region')) {
    const region = document.createElement('div');
    region.id = 'filter-range-live-region';
    region.className = 'sr-only';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
  }
  
  // Função de limpeza para useEffect
  return () => {
    const region = document.getElementById('filter-range-live-region');
    if (region && region.textContent?.includes(fieldName)) {
      region.textContent = '';
    }
  };
};
