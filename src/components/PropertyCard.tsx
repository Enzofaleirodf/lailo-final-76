
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { PropertyItem } from '@/types/property';
import { formatCurrency, formatUsefulArea } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";

interface PropertyCardProps {
  property: PropertyItem;
}

const PropertyCard: React.FC<PropertyCardProps> = React.memo(({
  property
}) => {
  // Guard clause to prevent rendering if property is undefined
  if (!property) {
    console.error('PropertyCard received undefined property data');
    return null;
  }

  const [favorited, setFavorited] = useState(false);
  const isMobile = useIsMobile();

  // Safely access nested properties with optional chaining
  const propertyType = property?.propertyInfo?.type || 'Imóvel';
  const usefulArea = property?.propertyInfo?.usefulAreaM2 || 0;
  const formattedArea = formatUsefulArea(usefulArea);

  // Calculate discount if original price exists
  const calculateDiscount = () => {
    if (property.originalPrice && property.originalPrice > property.currentBid) {
      const discount = Math.round((property.originalPrice - property.currentBid) / property.originalPrice * 100);
      // Only return the discount if it's greater than 0
      return discount > 0 ? discount : null;
    }
    return null;
  };

  // Format auction end date to show only last 2 digits of year
  const formatAuctionDate = (date: Date | undefined | string): string => {
    if (!date) return 'Data não disponível';
    
    try {
      const dateObject = typeof date === 'string' ? new Date(date) : date;
      const day = dateObject.getDate().toString().padStart(2, '0');
      const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
      const yearLastTwoDigits = dateObject.getFullYear().toString().slice(-2);
      
      return `${day}/${month}/${yearLastTwoDigits}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Data não disponível';
    }
  };

  const formatEndTime = (date: Date | undefined | string): string => {
    if (!date) return '';
    try {
      const dateObject = typeof date === 'string' ? new Date(date) : date;
      return `${dateObject.getHours()}h`;
    } catch (error) {
      return '';
    }
  };

  const discount = calculateDiscount();
  
  return (
    <motion.div 
      whileHover={{
        y: -4,
        transition: {
          duration: 0.2
        }
      }} 
      className={`${isMobile ? 'mb-2' : 'mb-3'} w-full`}
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full">
        {/* Content (right side) */}
        <div className={`flex flex-col ${isMobile ? 'p-3' : 'p-4'} w-full`}>
          {/* Top row with property type and area */}
          <div className="flex justify-between items-start gap-2 mb-1 w-full">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 tracking-tight ${isMobile ? 'text-sm leading-tight' : 'text-lg leading-tight'}`}>
              {propertyType} • {formattedArea}
            </h3>
            <button onClick={() => setFavorited(!favorited)} aria-label={favorited ? "Remove from favorites" : "Add to favorites"} className="flex-shrink-0">
              <Heart size={isMobile ? 16 : 20} className={`${favorited ? "fill-accent2-500 stroke-accent2-600" : ""} transition-colors`} />
            </button>
          </div>
          
          {/* Address row (movida de baixo para cima - agora é a segunda linha) */}
          <div className={`flex items-center text-gray-600 ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
            <MapPin size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" />
            <span className="line-clamp-1">{property.address || 'Endereço não disponível'} - {property.location || 'Localização não disponível'}</span>
          </div>

          {/* Price section (movida de cima para baixo - agora é a terceira linha) */}
          <div className={`flex items-center flex-wrap gap-2 ${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
            <span className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-xl'} leading-none`}>
              {formatCurrency(property.currentBid)}
            </span>
            {property.originalPrice && <div className="flex items-center gap-2">
                {discount && <span className="bg-accent2-50 text-accent2-900 px-2 py-0.5 rounded-md text-xs font-medium">
                    {discount}% OFF
                  </span>}
                <span className="text-gray-500 line-through text-xs">
                  {formatCurrency(property.originalPrice)}
                </span>
              </div>}
          </div>
          
          {/* Subtle divider with precisely 12px margin below */}
          <Separator className={`${isMobile ? 'mb-2 mt-1' : 'mb-3 mt-1'} bg-gray-100`} />
          
          {/* Bottom row with consistent 12px spacing from separator */}
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-1.5 flex-shrink min-w-0 overflow-hidden">
              <Badge variant="outline" className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded font-geist`}>
                {property.origin || 'Origem não disponível'}
              </Badge>
              <Badge variant="outline" className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded font-geist`}>
                {property.place || 'Praça não disponível'}
              </Badge>
            </div>
            <div className={`flex items-center bg-gray-50 rounded-md ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'} text-gray-700 font-medium ${isMobile ? 'text-xs' : 'text-xs'} whitespace-nowrap flex-shrink-0`}>
              <Calendar size={isMobile ? 10 : 12} className="mr-1 text-gray-500" />
              {property.endDate ? `${formatAuctionDate(property.endDate)} às ${formatEndTime(property.endDate)}` : 'Data não disponível'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

PropertyCard.displayName = 'PropertyCard';
export default PropertyCard;
