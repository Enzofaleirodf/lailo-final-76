
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
        y: -3,
        transition: { duration: 0.2 }
      }}
      className="mb-3"
    >
      <div className="flex p-4 rounded-xl bg-white border border-[#EAECF0] shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)]">
        {/* Image (left side) */}
        <div className="relative w-[30%] min-w-[100px]">
          <div className="relative h-full w-full flex">
            <div className="flex-1 relative overflow-hidden rounded-lg">
              {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />}
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
              
              {/* Image overlay */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 50%)",
                  pointerEvents: "none",
                }}
              />
              
              {/* Discount badge */}
              {discount && (
                <Badge className="absolute bottom-2 left-2 bg-green-600 text-white font-medium hover:bg-green-700 px-2 py-1">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content (right side) */}
        <div className="flex-1 pl-4 flex flex-col">
          {/* Top row: Title + Favorite button */}
          <div className="flex justify-between items-start">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 ${!isMobile ? 'text-[22px] leading-7' : 'text-[16px] leading-5'} tracking-tight`}>
              {auction.title}
            </h3>
            <button 
              onClick={() => setFavorited(!favorited)} 
              className={`p-1 -mt-1 -mr-1 rounded-full transition-colors ${favorited ? 'bg-red-50' : 'hover:bg-gray-100'}`}
            >
              <Heart 
                size={!isMobile ? 20 : 18} 
                className={favorited ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
          </div>
          
          {/* Vehicle info row */}
          <div className={`flex flex-wrap items-center gap-x-3 mt-1 text-gray-600 ${!isMobile ? 'text-[15px]' : 'text-[13px]'}`}>
            <div className="flex items-center">
              <SprayCan size={!isMobile ? 14 : 12} className="mr-1 text-gray-500" />
              {auction.vehicleInfo.color}
            </div>
            {auction.vehicleInfo.year && (
              <div className="flex items-center">
                <span className="text-gray-400 mx-1">•</span>
                {auction.vehicleInfo.year}
              </div>
            )}
            {auction.location && (
              <div className="flex items-center">
                <span className="text-gray-400 mx-1">•</span>
                <MapPin size={!isMobile ? 14 : 12} className="mr-1 text-gray-500" />
                <span className="line-clamp-1">{auction.location}</span>
              </div>
            )}
          </div>
          
          {/* Price section */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`font-bold text-gray-900 ${!isMobile ? 'text-[24px] leading-7' : 'text-[18px] leading-5'}`}>
              {formatCurrency(auction.currentBid)}
            </span>
            {discount && (
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs font-medium">
                {discount}% OFF
              </span>
            )}
            {auction.originalPrice && (
              <span className="text-gray-500 line-through text-sm">
                {formatCurrency(auction.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Divider */}
          <Separator className="my-3 bg-gray-100" />
          
          {/* Bottom row: Origin + Place and Date */}
          <div className={`flex justify-between items-center ${!isMobile ? 'text-[14px]' : 'text-[12px]'}`}>
            <div className="flex gap-1.5">
              <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal border-gray-200 hover:bg-gray-100 px-2">
                {auction.origin}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 font-normal border-gray-200 hover:bg-gray-100 px-2">
                {auction.place === 'Primeira' ? '1ª Praça' : '2ª Praça'}
              </Badge>
            </div>
            <div className="flex items-center bg-gray-50 rounded-md px-2 py-1 text-gray-700 font-medium text-xs">
              <Calendar size={!isMobile ? 13 : 11} className="mr-1 text-gray-500" />
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
