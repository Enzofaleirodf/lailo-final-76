
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin } from 'lucide-react';
import { AuctionItem } from '@/types/auction';
import { formatCurrency } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface AuctionCardProps {
  auction: AuctionItem;
}

const AuctionCard: React.FC<AuctionCardProps> = React.memo(({ auction }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [favorited, setFavorited] = useState(false);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Calcular o desconto se houver preço original
  const calculateDiscount = () => {
    if (auction.originalPrice && auction.originalPrice > auction.currentBid) {
      const discount = Math.round(((auction.originalPrice - auction.currentBid) / auction.originalPrice) * 100);
      return discount;
    }
    return null;
  };

  const discount = calculateDiscount();

  return (
    <motion.div
      whileHover={{ 
        y: -2, 
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg card-shadow">
        <div className="flex flex-col">
          {/* Imagem do veículo */}
          <div className="relative">
            <div className="aspect-video w-full h-48 relative">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <motion.img 
                src={auction.imageUrl} 
                alt={auction.title} 
                className={`object-cover w-full h-full transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                loading="lazy"
                onLoad={handleImageLoad}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Badge de formato (Extrajudicial ou similar) posicionado no canto esquerdo inferior */}
              <Badge className="absolute bottom-3 left-3 bg-gray-100 text-gray-800 hover:bg-gray-200">
                {auction.origin}
              </Badge>
              
              {/* Badge de tipo (Único ou similar) posicionado ao lado do primeiro badge */}
              <Badge className="absolute bottom-3 left-24 bg-gray-100 text-gray-800 hover:bg-gray-200">
                {auction.place}
              </Badge>
              
              {/* Botão de favoritar */}
              <button 
                onClick={() => setFavorited(!favorited)}
                className="absolute top-3 right-3 h-8 w-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-opacity-100"
              >
                <Heart 
                  size={18} 
                  className={favorited ? "fill-red-500 text-red-500" : "text-gray-600"} 
                />
              </button>
              
              {/* Badge de desconto, se houver */}
              {discount && (
                <Badge className="absolute top-3 left-3 bg-green-600 text-white hover:bg-green-700">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>
          
          {/* Conteúdo/Informações */}
          <div className="p-4 flex flex-col gap-1">
            {/* Título/Modelo */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{auction.title}</h3>
            </div>
            
            {/* Cor e Ano */}
            <div className="flex gap-2 items-center text-sm text-gray-600">
              <span>{auction.vehicleInfo.color}</span>
              <span className="text-gray-400">•</span>
              <span>{auction.vehicleInfo.year}</span>
            </div>
            
            {/* Localização */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin size={14} className="mr-1" />
              <span className="line-clamp-1">{auction.location}</span>
            </div>
            
            {/* Preço e Data de término */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-col">
                <p className="text-2xl font-bold text-purple-700">
                  {formatCurrency(auction.currentBid)}
                </p>
                {auction.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(auction.originalPrice)}
                  </p>
                )}
              </div>
              
              {/* Data de término */}
              <Badge variant="outline" className="flex items-center gap-1">
                <span className="text-xs">{auction.endDate.toLocaleDateString('pt-BR')}</span>
                <span className="text-xs text-gray-500">às {auction.endDate.getHours()}h</span>
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

AuctionCard.displayName = 'AuctionCard';

export default AuctionCard;
