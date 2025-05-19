
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, SprayCan, MapPin } from 'lucide-react';
import { AuctionItem } from '@/types/auction';
import { formatCurrency } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";

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

  // Calculate discount if original price exists
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
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="mb-4"
    >
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image (left side) */}
        <div className="relative w-[35%] min-w-[130px]">
          <div className="relative h-full w-full">
            {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
            <img
              src={auction.imageUrl}
              alt={auction.title}
              className="h-full w-full object-cover"
              loading="lazy"
              onLoad={handleImageLoad}
              style={{
                aspectRatio: '4/3',
                objectFit: 'cover'
              }}
            />
            
            {/* Image gradient overlay for better text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%)",
                pointerEvents: "none",
              }}
            />
            
            {/* Discount badge - redesigned with more prominent styling */}
            {discount && (
              <Badge className="absolute bottom-3 left-3 bg-green-600 hover:bg-green-700 text-white font-medium px-2.5 py-1 text-xs shadow-sm">
                {discount}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Content (right side) */}
        <div className="flex-1 flex flex-col p-4">
          {/* Top row with improved spacing and alignment */}
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 tracking-tight ${!isMobile ? 'text-lg leading-tight' : 'text-base leading-tight'}`}>
              {auction.title}
            </h3>
            <button 
              onClick={() => setFavorited(!favorited)} 
              className={`flex-shrink-0 p-1.5 -mr-1 rounded-full transition-all ${favorited ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-500'}`}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={isMobile ? 18 : 20} 
                className={`${favorited ? "fill-red-500" : ""} transition-colors`}
              />
            </button>
          </div>
          
          {/* Vehicle info row - better structured and aligned */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
            <div className="flex items-center text-gray-600 text-xs">
              <SprayCan size={12} className="mr-1 text-gray-500" />
              <span>{auction.vehicleInfo.color}</span>
            </div>
            {auction.vehicleInfo.year && (
              <div className="flex items-center text-gray-600 text-xs">
                <span className="text-gray-400 mx-1">•</span>
                <span>{auction.vehicleInfo.year}</span>
              </div>
            )}
            {auction.location && (
              <div className="flex items-center text-gray-600 text-xs">
                <span className="text-gray-400 mx-1">•</span>
                <MapPin size={12} className="mr-1 text-gray-500" />
                <span className="line-clamp-1">{auction.location}</span>
              </div>
            )}
          </div>
          
          {/* Price section - more prominent with better hierarchy */}
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="font-bold text-gray-900 text-xl leading-none">
              {formatCurrency(auction.currentBid)}
            </span>
            {auction.originalPrice && (
              <div className="flex items-center gap-2">
                {discount && (
                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs font-medium">
                    {discount}% OFF
                  </span>
                )}
                <span className="text-gray-500 line-through text-sm">
                  {formatCurrency(auction.originalPrice)}
                </span>
              </div>
            )}
          </div>
          
          {/* Subtle divider */}
          <Separator className="my-3 bg-gray-100" />
          
          {/* Bottom row - redesigned badges and date indicator */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-1.5">
              <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal border-gray-200 text-xs px-2 py-0.5">
                {auction.origin}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal border-gray-200 text-xs px-2 py-0.5">
                {auction.place === 'Primeira' ? '1ª Praça' : '2ª Praça'}
              </Badge>
            </div>
            <div className="flex items-center bg-gray-50 rounded-md px-2 py-1 text-gray-700 font-medium text-xs">
              <Calendar size={12} className="mr-1 text-gray-500" />
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
