
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
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
  const daysRemaining = Math.ceil((auction.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getFormatBadgeColor = () => {
    return auction.format === 'Leilão' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700';
  };
  
  const getBidStatusColor = () => {
    if (daysRemaining <= 1) return 'text-red-600';
    if (daysRemaining <= 3) return 'text-orange-600';
    return 'text-green-600';
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

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
        <div className="flex flex-col sm:flex-row">
          {/* Image on the left */}
          <div className="relative w-full sm:w-2/5 lg:w-1/3">
            <div className="aspect-video sm:aspect-square w-full h-full relative">
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
              <Badge className={`absolute top-3 left-3 ${getFormatBadgeColor()} transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
                {auction.format}
              </Badge>
            </div>
          </div>
          
          {/* Content on the right */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{auction.title}</h3>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin size={14} className="mr-1" />
              <span className="line-clamp-1">{auction.location}</span>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {auction.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-between mt-auto">
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-xs text-gray-500">Lance atual</p>
                <motion.p 
                  className="text-xl font-bold text-purple-700"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {formatCurrency(auction.currentBid)}
                </motion.p>
              </motion.div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Clock size={16} className={`mr-1 ${getBidStatusColor()}`} />
                  <span className={`text-sm font-medium ${getBidStatusColor()}`}>
                    {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                  </span>
                </div>
                
                <Badge 
                  variant="outline" 
                  className="text-purple-700 border-purple-200 hover:bg-purple-50 transition-all duration-200"
                >
                  {auction.vehicleInfo.brand} {auction.vehicleInfo.year}
                </Badge>
              </div>
            </div>
            
            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
              <span className="text-xs text-gray-500">{auction.bidCount} lances</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

AuctionCard.displayName = 'AuctionCard';

export default AuctionCard;
