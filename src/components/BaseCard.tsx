
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";
import FavoriteButton from './FavoriteButton';

export interface BaseCardProps {
  id: string;
  title: string;
  price: {
    current: number;
    original?: number;
  };
  extraInfo: React.ReactNode; // Para detalhes específicos do tipo de conteúdo
  location?: string;
  origin?: string;
  place?: string;
  endDate?: Date | string;
  onToggleFavorite?: (id: string, isFavorited: boolean) => void;
  isFavorited?: boolean;
}

// Função para formatar data de leilão (mostrando apenas os 2 últimos dígitos do ano)
export const formatAuctionDate = (date: Date | undefined | string): string => {
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

// Função para formatar horário final
export const formatEndTime = (date: Date | undefined | string): string => {
  if (!date) return '';
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return `${dateObject.getHours()}h`;
  } catch (error) {
    return '';
  }
};

// Função para calcular o desconto
export const calculateDiscount = (originalPrice?: number, currentPrice?: number): number | null => {
  if (originalPrice && currentPrice && originalPrice > currentPrice) {
    const discount = Math.round((originalPrice - currentPrice) / originalPrice * 100);
    // Only return the discount if it's greater than 0
    return discount > 0 ? discount : null;
  }
  return null;
};

const BaseCard: React.FC<BaseCardProps> = ({
  id,
  title,
  price,
  extraInfo,
  location,
  origin,
  place,
  endDate,
  onToggleFavorite,
  isFavorited = false
}) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const isMobile = useIsMobile();
  
  // Calcular desconto com base nos preços original e atual
  const discount = calculateDiscount(price.original, price.current);
  
  const handleToggleFavorite = (id: string, newFavoritedState: boolean) => {
    setFavorited(newFavoritedState);
    if (onToggleFavorite) {
      onToggleFavorite(id, newFavoritedState);
    }
  };
  
  return (
    <motion.div 
      whileHover={{
        y: -4,
        transition: { duration: 0.2 }
      }} 
      className={`${isMobile ? 'mb-2' : 'mb-3'} w-full`}
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full">
        {/* Content */}
        <div className={`flex flex-col ${isMobile ? 'p-3' : 'p-4'} w-full`}>
          {/* Top row with title and favorite button */}
          <div className="flex justify-between items-start gap-2 mb-1 w-full items-center">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 tracking-tight ${isMobile ? 'text-sm leading-tight' : 'text-lg leading-tight'} font-urbanist`}>
              {title}
            </h3>
            <FavoriteButton 
              itemId={id} 
              isFavorited={favorited} 
              onToggleFavorite={handleToggleFavorite} 
            />
          </div>
          
          {/* ExtraInfo row - específico para cada tipo de conteúdo */}
          <div className={`flex items-center text-gray-600 ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'} font-urbanist`}>
            {extraInfo}
          </div>
          
          {/* Price section */}
          <div className={`flex items-center flex-wrap gap-2 ${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
            <span className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-xl'} leading-none font-urbanist`}>
              {formatCurrency(price.current)}
            </span>
            {price.original && (
              <div className="flex items-center gap-2">
                {discount && (
                  <span className="bg-accent2-400 px-2 py-0.5 rounded-md text-xs font-medium text-inherit font-urbanist">
                    {discount}% OFF
                  </span>
                )}
                <span className="text-gray-500 line-through text-xs font-urbanist">
                  {formatCurrency(price.original)}
                </span>
              </div>
            )}
          </div>
          
          {/* Subtle divider */}
          <Separator className={`${isMobile ? 'mb-2 mt-1' : 'mb-3 mt-1'} bg-gray-100`} />
          
          {/* Bottom row with auction details */}
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-1.5 flex-shrink min-w-0 overflow-hidden">
              <Badge 
                variant="outline" 
                className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded font-urbanist`}
              >
                {origin || 'Origem não disponível'}
              </Badge>
              <Badge 
                variant="outline" 
                className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded font-urbanist`}
              >
                {place || 'Praça não disponível'}
              </Badge>
            </div>
            <div 
              className={`flex items-center bg-gray-50 rounded-md ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'} text-gray-700 font-medium ${isMobile ? 'text-xs' : 'text-xs'} whitespace-nowrap flex-shrink-0 font-urbanist`}
            >
              <Calendar size={isMobile ? 10 : 12} className="mr-1 text-gray-500" />
              {endDate ? `${formatAuctionDate(endDate)} às ${formatEndTime(endDate)}` : 'Data não disponível'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BaseCard);
