import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { COLORS, TYPOGRAPHY } from '@/constants/designSystem';
import { getCardStyles } from '@/utils/styleUtils';
import { Separator } from "@/components/ui/separator";
import FavoriteButton from './FavoriteButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

export interface BaseCardProps {
  id: string;
  title: string;
  price: {
    current: number;
    original?: number;
  };
  extraInfo: React.ReactNode; // Para detalhes específicos do tipo de conteúdo
  imageUrl?: string; // Adicionado imageUrl
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
  imageUrl,
  location,
  origin,
  place,
  endDate,
  onToggleFavorite,
  isFavorited = false
}) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Calcular desconto com base nos preços original e atual
  const discount = calculateDiscount(price.original, price.current);
  
  const handleToggleFavorite = (id: string, newFavoritedState: boolean) => {
    setFavorited(newFavoritedState);
    if (onToggleFavorite) {
      onToggleFavorite(id, newFavoritedState);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Verificar se o leilão está próximo do fim (menos de 24h)
  const isEndingSoon = () => {
    if (!endDate) return false;
    
    const now = new Date();
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const hoursLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursLeft > 0 && hoursLeft <= 24;
  };
  
  // Altura fixa padrão para todos os cards
  const cardHeight = isMobile ? '150px' : '180px';
  
  return (
    <motion.div 
      whileHover={{
        y: -4, 
        transition: { duration: 0.2 }
      }} 
      whileTap={{ scale: 0.98 }}
      className={`${isMobile ? 'mb-2' : 'mb-3'} w-full`}
      data-testid="base-card"
    >
      {/* Card Container - Definindo altura fixa para padronização */}
      <div 
        className={cn(getCardStyles(true), "w-full flex flex-row overflow-hidden")}
        style={{ height: cardHeight }}
      >
        {/* Área da imagem - posicionada à esquerda COM PADDING, exceto no lado direito */}
        {imageUrl && (
          <div className={`relative w-1/3 h-full bg-white overflow-hidden ${isMobile ? 'pt-3 pl-3 pb-3 pr-0' : 'pt-4 pl-4 pb-4 pr-0'}`}>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div> 
              </div>
            )}
            <img 
              src={imageUrl} 
              alt={title} 
              className={`w-full h-full object-cover transition-opacity duration-300 rounded-lg ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={handleImageLoad}
              aria-hidden={!imageLoaded}
              style={{ objectPosition: 'center' }}
            />
            
            {/* Indicador de "terminando em breve" */}
            {isEndingSoon() && (
              <div className={`absolute top-2 left-2 ${COLORS.bg.error} ${COLORS.text.white} px-2 py-0.5 rounded text-xs font-medium`}>
                Termina em breve
              </div>
            )}
          </div>
        )}
        
        {/* Content - posicionado à direita */}
        <div 
          className={`flex flex-col ${isMobile ? 'p-3' : 'p-4'} ${imageUrl ? 'w-2/3' : 'w-full'}`}
          role="group"
          aria-label={`Card de ${title}`}
        >
          {/* Div pai que agrupa todo o conteúdo */}
          <div className="flex flex-col w-full h-full justify-between">
            <div>
              {/* Linha 1 - título e botão favorito */}
              <div className="flex justify-between items-start gap-2 mb-1 w-full items-center">
                <h3 className={`${TYPOGRAPHY.weight.semibold} ${COLORS.text.gray[900]} line-clamp-1 ${TYPOGRAPHY.tracking.tight} ${isMobile ? 'text-sm leading-tight' : 'text-lg leading-tight'} ${TYPOGRAPHY.family.urbanist}`}>
                  {title}
                </h3>
                <FavoriteButton 
                  itemId={id} 
                  isFavorited={favorited} 
                  onToggleFavorite={handleToggleFavorite} 
                  aria-label={favorited ? `Remover ${title} dos favoritos` : `Adicionar ${title} aos favoritos`}
                />
              </div>
              
              {/* Linha 2 - ExtraInfo específico para cada tipo de conteúdo */}
              <div className={`flex items-center ${COLORS.text.gray[600]} ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'} ${TYPOGRAPHY.family.urbanist}`}>
                {extraInfo}
              </div>
              
              {/* Linha 3 - Preço e desconto */}
              <div className={`flex items-center flex-wrap gap-2 ${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
                <span className={`${TYPOGRAPHY.weight.bold} ${COLORS.text.gray[900]} ${isMobile ? 'text-base' : 'text-xl'} ${TYPOGRAPHY.leading.none} ${TYPOGRAPHY.family.urbanist}`}>
                  {formatCurrency(price.current)}
                </span>
                {price.original && (
                  <div className="flex items-center gap-2" aria-label={discount ? `Desconto de ${discount}%` : ''}>
                    {discount && (
                      <span className="bg-accent2-400 px-2 py-0.5 rounded-md text-xs font-medium text-inherit font-urbanist">
                        {discount}% OFF
                      </span> 
                    )}
                    <span className={`${COLORS.text.gray[500]} line-through text-xs ${TYPOGRAPHY.family.urbanist}`}>
                      {formatCurrency(price.original)} 
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Divisor */}
            <Separator className={`${isMobile ? 'my-2' : 'my-3'} ${COLORS.bg.gray[100]}`} />
            
            {/* Linha 4 - Detalhes do leilão */}
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
                aria-label={`Data final: ${endDate ? formatAuctionDate(endDate) + ' às ' + formatEndTime(endDate) : 'Data não disponível'}`}
              >
                <Calendar size={isMobile ? 10 : 12} className="mr-1 text-gray-500" aria-hidden="true" />
                {endDate ? `${formatAuctionDate(endDate)} às ${formatEndTime(endDate)}` : 'Data não disponível'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(BaseCard);