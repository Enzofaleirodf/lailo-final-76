
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, CalendarIcon } from 'lucide-react';
import { AuctionItem } from '@/types/auction';
import { formatCurrency } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
interface AuctionCardProps {
  auction: AuctionItem;
}
const AuctionCard: React.FC<AuctionCardProps> = React.memo(({
  auction
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [favorited, setFavorited] = useState(false);
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
  return <motion.div whileHover={{
    y: -2,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)'
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="h-full">
      <Card className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg card-shadow h-full flex flex-col">
        <div className="flex h-full">
          {/* Imagem do veículo à esquerda */}
          <div className="relative w-1/3 h-full flex-1 p-3">
            <div className="h-full relative">
              {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
              <motion.img src={auction.imageUrl} alt={auction.title} className={`object-cover w-full h-full transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }} loading="lazy" onLoad={handleImageLoad} initial={{
              opacity: 0
            }} animate={{
              opacity: imageLoaded ? 1 : 0
            }} transition={{
              duration: 0.5
            }} />
              
              {/* Badge de desconto, se houver */}
              {discount && <Badge className="absolute bottom-2 left-2 bg-green-600 text-white hover:bg-green-700">
                  {discount}% OFF
                </Badge>}
            </div>
          </div>
          
          {/* Conteúdo/Informações à direita */}
          <div className="w-2/3 p-4 flex flex-col justify-between">
            <div>
              {/* Linha 1: Marca + Modelo + Botão Favoritar */}
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {auction.vehicleInfo.brand} {auction.title}
                </h3>
                
                {/* Botão de favoritar */}
                <button onClick={() => setFavorited(!favorited)} className="h-8 w-8 flex items-center justify-center transition-all duration-200">
                  <Heart size={20} className={favorited ? "fill-red-500 text-red-500" : "text-gray-600"} />
                </button>
              </div>
              
              {/* Linha 2: Lance atual + desconto */}
              <div className="flex items-end gap-2 mb-2">
                <span className="text-xl font-bold text-purple-700">
                  {formatCurrency(auction.currentBid)}
                </span>
                {auction.originalPrice && <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(auction.originalPrice)}
                  </span>}
              </div>
              
              {/* Linha 3: Cor • Ano | Cidade/UF */}
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: auction.vehicleInfo.color.toLowerCase() }}></span>
                  <span>{auction.vehicleInfo.color}</span>
                </div>
                <span className="mx-2"></span>
                <div className="flex items-center">
                  <CalendarIcon size={14} className="mr-1" />
                  <span>{auction.vehicleInfo.year}</span>
                </div>
                <span className="mx-1">|</span>
                <span className="line-clamp-1">{auction.location}</span>
              </div>
            </div>
            
            {/* Linha 4: Divider */}
            <Separator className="my-3" />
            
            {/* Linha 5: Origem + Etapa (esquerda) / Data e hora (direita) */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {auction.origin}
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {auction.place}
                </Badge>
              </div>
              
              <Badge variant="outline" className="text-xs">
                {formatAuctionDate(auction.endDate)} às {auction.endDate.getHours()}h
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>;
});
AuctionCard.displayName = 'AuctionCard';
export default AuctionCard;
