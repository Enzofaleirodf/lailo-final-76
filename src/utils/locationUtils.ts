
// Lista de estados brasileiros para o componente de filtro de localização
export const getAllStates = (): string[] => {
  return [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
};

// Função que retorna cidades com base no estado selecionado
// Normalmente, isso viria de uma API
export const getCitiesByState = (state: string): string[] => {
  // Dados mockados para exemplificar
  const cityMap: { [key: string]: string[] } = {
    'SP': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'São José dos Campos'],
    'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu', 'Angra dos Reis'],
    'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
    // Outros estados teriam suas próprias cidades
  };
  
  return cityMap[state] || [];
};
