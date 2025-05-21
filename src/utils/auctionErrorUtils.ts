
/**
 * @fileoverview Utilitários para tratamento de erros em operações de leilão
 * Fornece funções para lidar com erros de forma consistente
 */

/**
 * Registra um erro no console com informações adicionais
 * para facilitar a depuração
 */
export const logError = (
  error: unknown, 
  source: string,
  additionalInfo?: Record<string, any>
): void => {
  // Formatar mensagem de erro para console
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Erro em ${source}:`);
  console.error(error);
  
  // Incluir informações adicionais se fornecidas
  if (additionalInfo) {
    console.error('Informações adicionais:', additionalInfo);
  }
};

/**
 * Gera uma mensagem de erro amigável para o usuário
 * com base no tipo de erro
 */
export const getUserFriendlyErrorMessage = (
  error: unknown,
  contentType: string
): string => {
  // Tentar extrair mensagem do erro
  let errorMessage = 'Ocorreu um erro desconhecido';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  // Verificar se é um erro de rede
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  // Verificar se é um erro de timeout
  if (errorMessage.includes('timeout')) {
    return 'A operação demorou muito para responder. Tente novamente mais tarde.';
  }
  
  // Erro padrão baseado no tipo de conteúdo
  return `Ocorreu um erro ao carregar os ${contentType === 'property' ? 'imóveis' : 'leilões'}. Tente novamente.`;
};
