
import React from 'react';
import BuscadorLayout from '@/components/BuscadorLayout';
import { useBuscadorSetup } from '@/hooks/useBuscadorSetup';
import { ContentType } from '@/types/filters';

interface BuscadorProps {
  contentType: ContentType;
}

/**
 * Componente genérico de busca que pode ser usado para diferentes tipos de conteúdo
 * (imóveis ou veículos) com base no contentType fornecido.
 * Encapsula toda a lógica comum de busca e filtros.
 */
const Buscador: React.FC<BuscadorProps> = ({ contentType }) => {
  // Usar o hook personalizado para configurar o tipo de conteúdo
  const { initialSetupDone } = useBuscadorSetup(contentType);
  
  return <BuscadorLayout />;
};

export default Buscador;
