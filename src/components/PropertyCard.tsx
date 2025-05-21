
import React from 'react';
import { PropertyItem } from '@/types/property';
import { formatUsefulArea } from '@/utils/auctionUtils';
import BaseCard from './BaseCard';

interface PropertyCardProps {
  property: PropertyItem;
}

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
    <span className="line-clamp-1 mb-1">
      {property.address || 'Endereço não disponível'} - {property.location || 'Localização não disponível'}
    </span>
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
      location={property.location}
      origin={property.origin}
      place={property.place}
      endDate={property.endDate}
    />
  );
});

PropertyCard.displayName = 'PropertyCard';
export default PropertyCard;
