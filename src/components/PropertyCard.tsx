
import React from 'react';
import { PropertyItem } from '@/types/property';
import { formatUsefulArea } from '@/utils/auctionUtils';
import { handleError } from '@/utils/errorUtils';
import ErrorBoundary from './ErrorBoundary';
import BaseCard from './BaseCard';

interface PropertyCardProps {
  property: PropertyItem;
}

/**
 * Componente responsável por renderizar um card de imóvel
 * Reutiliza o BaseCard para manter consistência visual e comportamental
 * 
 * @param property - Objeto com informações do imóvel a ser exibido
 * @returns Componente de card de imóvel
 */
const PropertyCard: React.FC<PropertyCardProps> = React.memo(({ property }) => {
  // Guard clause para evitar renderização se property for undefined
  if (!property) {
    handleError(new Error('PropertyCard received undefined property data'), 'PropertyCard');
    return null;
  }
  
  // Acessar propriedades aninhadas com optional chaining
  let propertyType = property?.propertyInfo?.type || 'Imóvel';
  
  // Garantir que o tipo esteja no singular
  if (propertyType.endsWith('s') && propertyType !== 'Prédios') {
    propertyType = propertyType.slice(0, -1);
  } else if (propertyType.endsWith('is')) {
    propertyType = propertyType.replace(/is$/, 'l');
  } else if (propertyType.endsWith('ões')) {
    propertyType = propertyType.replace(/ões$/, 'ão');
  } else if (propertyType.endsWith('ns')) {
    propertyType = propertyType.replace(/ns$/, 'm');
  }
  
  const usefulArea = property?.propertyInfo?.usefulAreaM2 || 0;
  const formattedArea = formatUsefulArea(usefulArea);
  
  // Construir o componente de informações extras específico para imóveis
  const extraInfo = (
    <div className="flex flex-col w-full">
      <span 
        className="line-clamp-1 mb-1"
        title={`${property.address || 'Endereço não disponível'} - ${property.location || 'Localização não disponível'}`}
      >
        {property.address || 'Endereço não disponível'} - {property.location || 'Localização não disponível'}
      </span>
    </div>
  );
  
  return (
    <ErrorBoundary componentName="PropertyCard">
      <BaseCard 
        id={property.id}
        title={`${propertyType} • ${formattedArea}`}
        price={{
          current: property.currentBid,
          original: property.originalPrice
        }}
        extraInfo={extraInfo}
        imageUrl={property.imageUrl}
        location={property.location}
        origin={property.origin}
        place={property.place}
        endDate={property.endDate}
      />
    </ErrorBoundary>
  );
});

// Definir displayName para debugging e React DevTools
PropertyCard.displayName = 'PropertyCard';
export default PropertyCard;
