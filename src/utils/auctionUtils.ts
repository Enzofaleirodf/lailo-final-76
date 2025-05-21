
/**
 * Formata moeda para o formato brasileiro (R$ X.XXX,XX)
 * @param value - Valor em reais para formatação
 * @returns String formatada no padrão de moeda brasileiro
 */
export const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return 'Preço não disponível';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formata o valor da área útil com a unidade de medida
 * @param area - Área útil em metros quadrados
 * @returns String formatada (XXXm²)
 */
export const formatUsefulArea = (area: number): string => {
  return `${area}m²`;
};

/**
 * Formata o contador de lances para exibição
 * @param count - Número de lances
 * @returns String formatada (X lance(s))
 */
export const formatBidCount = (count: number): string => {
  return `${count} lance${count !== 1 ? 's' : ''}`;
};

/**
 * Calcula o percentual de desconto entre dois valores
 * @param originalPrice - Preço original
 * @param currentPrice - Preço atual
 * @returns Percentual de desconto ou null se não houver desconto
 */
export const calculateDiscount = (originalPrice?: number, currentPrice?: number): number | null => {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return null;
  }
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Formata a distância para exibição amigável
 * @param distance - Distância em km
 * @returns String formatada
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    // Converter para metros
    const meters = Math.round(distance * 1000);
    return `${meters}m`;
  }
  
  return `${distance.toFixed(1)}km`;
};

/**
 * Formata a data de término do leilão
 * @param date - Data de término
 * @returns Data formatada DD/MM/AA
 */
export const formatAuctionDate = (date?: Date): string => {
  if (!date) return 'Data não disponível';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  
  return `${day}/${month}/${year}`;
};

/**
 * Formata o horário de término do leilão
 * @param date - Data de término
 * @returns Horário formatado HH:MM
 */
export const formatAuctionTime = (date?: Date): string => {
  if (!date) return '';
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Verifica se um leilão está próximo do fim
 * @param endDate - Data de término do leilão
 * @param thresholdHours - Limite de horas para considerar "próximo do fim"
 * @returns boolean indicando se está próximo do fim
 */
export const isAuctionEndingSoon = (endDate?: Date, thresholdHours: number = 24): boolean => {
  if (!endDate) return false;
  
  const now = new Date();
  const hoursRemaining = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return hoursRemaining > 0 && hoursRemaining <= thresholdHours;
};
