
import React from 'react';
import { PropertyItem } from '@/types/property';
import { formatUsefulArea } from '@/utils/auctionUtils';
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
    console.error('PropertyCard received undefined property data');
    return null;
  }
  
  // Acessar propriedades aninhadas com optional chaining
  const propertyType = property?.propertyInfo?.type || 'Imóvel';
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
  );
});

// Definir displayName para debugging e React DevTools
PropertyCard.displayName = 'PropertyCard';
export default PropertyCard;
