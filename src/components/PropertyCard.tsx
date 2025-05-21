
import React from 'react';
import { PropertyItem } from '@/types/property';
import { formatUsefulArea } from '@/utils/auctionUtils';
import BaseCard from './BaseCard';
import { Bed, Bath, Car } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const isMobile = useIsMobile();
  
  // Acessar propriedades aninhadas com optional chaining
  const propertyType = property?.propertyInfo?.type || 'Imóvel';
  const usefulArea = property?.propertyInfo?.usefulAreaM2 || 0;
  const formattedArea = formatUsefulArea(usefulArea);
  const bedrooms = property?.propertyInfo?.bedrooms;
  const bathrooms = property?.propertyInfo?.bathrooms;
  const garages = property?.propertyInfo?.garages;
  
  // Construir o componente de informações extras específico para imóveis
  const extraInfo = (
    <div className="flex flex-col w-full">
      <span 
        className="line-clamp-1 mb-1"
        title={`${property.address || 'Endereço não disponível'} - ${property.location || 'Localização não disponível'}`}
      >
        {property.address || 'Endereço não disponível'} - {property.location || 'Localização não disponível'}
      </span>
      
      {/* Ícones de detalhes do imóvel (quartos, banheiros, vagas) */}
      <div className="flex items-center gap-2 text-gray-600" aria-label="Detalhes do imóvel">
        {bedrooms !== undefined && (
          <div className="flex items-center" title={`${bedrooms} quarto${bedrooms !== 1 ? 's' : ''}`}>
            <Bed size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs">{bedrooms}</span>
          </div>
        )}
        
        {bathrooms !== undefined && (
          <div className="flex items-center ml-2" title={`${bathrooms} banheiro${bathrooms !== 1 ? 's' : ''}`}>
            <Bath size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs">{bathrooms}</span>
          </div>
        )}
        
        {garages !== undefined && (
          <div className="flex items-center ml-2" title={`${garages} vaga${garages !== 1 ? 's' : ''}`}>
            <Car size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs">{garages}</span>
          </div>
        )}
      </div>
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
