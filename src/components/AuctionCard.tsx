
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, SprayCan } from 'lucide-react';
import { AuctionItem } from '@/types/auction';
import { formatCurrency } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuctionCardProps {
  auction: AuctionItem;
}

const AuctionCard: React.FC<AuctionCardProps> = React.memo(({
  auction
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const isMobile = useIsMobile();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Calcular o desconto se houver preço original
  const calculateDiscount = () => {
    if (auction.originalPrice && auction.originalPrice > auction.currentBid) {
      const discount = Math.round((auction.originalPrice - auction.currentBid) / auction.originalPrice * 100);
      return discount;
    }
    return null;
  };

  // Format auction end date to show only last 2 digits of year
  const formatAuctionDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const yearLastTwoDigits = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${yearLastTwoDigits}`;
  };

  const discount = calculateDiscount();

  return (
    <motion.div 
      whileHover={{
        y: -2,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)'
      }}
      className="mb-2"
    >
      <div className="flex p-3 rounded-xl bg-white border border-[#E5E5E5] shadow-sm">
        {/* Imagem (lado esquerdo) */}
        <div className="relative w-[30%] min-w-[96px]">
          <div className="relative h-full w-full flex">
            <div className="flex-1 relative overflow-hidden rounded-lg">
              {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />}
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="h-full w-full object-cover rounded-lg"
                loading="lazy"
                onLoad={handleImageLoad}
                style={{
                  aspectRatio: '4/3',
                  objectFit: 'cover'
                }}
              />
              {/* Degradê sobre a imagem */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 50%)",
                  pointerEvents: "none",
                }}
              />
              
              {/* Badge de desconto, se houver */}
              {discount && (
                <Badge className="absolute bottom-2 left-2 bg-green-600 text-white hover:bg-green-700">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo (lado direito) */}
        <div className="flex-1 pl-3 flex flex-col">
          {/* Linha 1: Modelo - removida duplicação da marca */}
          <div className="flex justify-between items-center">
            <div className={`font-semibold text-black line-clamp-1 ${!isMobile ? 'text-[22px]' : 'text-[16px]'}`}>
              {auction.title}
            </div>
            <button onClick={() => setFavorited(!favorited)} className="p-0.5">
              <Heart size={!isMobile ? 20 : 16} className={favorited ? "fill-red-500 text-red-500" : "text-[#6E6E73]"} />
            </button>
          </div>
          
          {/* Linha 2: Cor, Ano e Cidade/Estado */}
          <div className={`flex items-center mt-1 text-gray-700 ${!isMobile ? 'text-[17px]' : 'text-[13px]'}`}>
            <div className="flex items-center mr-2">
              <SprayCan size={!isMobile ? 14 : 10} className="mr-0.5 text-gray-500" />
              {auction.vehicleInfo.color}
            </div>
            <div className="flex items-center">
              <Calendar size={!isMobile ? 14 : 10} className="mr-0.5 text-gray-500" />
              {auction.vehicleInfo.year}
            </div>
            <div className="mx-2 h-3 border-r border-gray-300"></div>
            <div className="text-gray-500 line-clamp-1">{auction.location}</div>
          </div>
          
          {/* Linha 3: Preço + Badge */}
          <div className="flex items-center gap-1.5 mt-3">
            <span className={`font-bold text-black ${!isMobile ? 'text-[22px]' : 'text-[16px]'}`}>
              {formatCurrency(auction.currentBid)}
            </span>
            {discount && (
              <span className={`bg-teal-600 text-white px-2 py-0.5 rounded-md ${!isMobile ? 'text-[15px]' : 'text-[11px]'}`}>
                {discount}% OFF
              </span>
            )}
          </div>
          
          {/* Divider */}
          <div className="border-t border-[#E5E5EA] mt-4 mb-4"></div>
          
          {/* Linha 4: Origem + Etapa e Data + Hora */}
          <div className={`flex justify-between items-center ${!isMobile ? 'text-[16px]' : 'text-[12px]'}`}>
            <div className="flex gap-1.5">
              <span className="border border-gray-300 rounded-md px-1.5 py-0.5 text-gray-600">
                {auction.origin}
              </span>
              <span className="border border-gray-300 rounded-md px-1.5 py-0.5 text-gray-600">
                {auction.place === 'Primeira' ? '1ª Praça' : '2ª Praça'}
              </span>
            </div>
            <div className="flex items-center bg-gray-100 rounded-md px-1.5 py-0.5 text-gray-700 font-medium">
              <Calendar size={!isMobile ? 14 : 10} className="mr-1 text-gray-500" />
              {formatAuctionDate(auction.endDate)} às {auction.endDate.getHours()}h
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

AuctionCard.displayName = 'AuctionCard';
export default AuctionCard;
