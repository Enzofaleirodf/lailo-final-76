
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Palette, Hourglass } from 'lucide-react';
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
  const [favorited, setFavorited] = useState(false);
  const isMobile = useIsMobile();

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

  // Determine if the auction is new (less than 24 hours old)
  const isNew = () => {
    const today = new Date();
    const auctionDate = new Date(auction.createdAt || today);
    const diffTime = Math.abs(today.getTime() - auctionDate.getTime());
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours < 24;
  };

  // Extract vehicle brand and model (without year)
  const getVehicleTitle = () => {
    // Remove any year pattern like "2021" from the title
    return auction.title.replace(/\s+\d{4}$|\s+\d{4}\s+/, ' ').trim();
  };
  
  // Check if this is a vehicle item
  const isVehicleItem = auction.vehicleInfo && 
    (auction.vehicleInfo.type === 'car' || 
     auction.vehicleInfo.type === 'motorcycle' || 
     auction.vehicleInfo.type === 'truck');
  
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
          {/* Top row with improved spacing and alignment */}
          <div className="flex justify-between items-start gap-2 mb-1 w-full">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 tracking-tight ${isMobile ? 'text-sm leading-tight' : 'text-lg leading-tight'}`}>
              {getVehicleTitle()}
            </h3>
            <button onClick={() => setFavorited(!favorited)} aria-label={favorited ? "Remove from favorites" : "Add to favorites"} className="flex-shrink-0">
              <Heart size={isMobile ? 16 : 20} className={`${favorited ? "fill-accent2-500 stroke-accent2-600" : ""} transition-colors`} />
            </button>
          </div>
          
          {/* Vehicle info row - only shown for vehicle items with proper null checks */}
          {isVehicleItem && auction.vehicleInfo && (
            <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
              {auction.vehicleInfo.color && (
                <div className="flex items-center text-gray-600 text-xs">
                  <Palette size={12} className="mr-1 text-gray-500" />
                  <span>{auction.vehicleInfo.color}</span>
                </div>
              )}
              
              {auction.vehicleInfo.year && (
                <div className="flex items-center text-gray-600 text-xs">
                  <Hourglass size={12} className="mr-1 text-gray-500" />
                  <span>{auction.vehicleInfo.year}</span>
                </div>
              )}
              
              {auction.location && (
                <div className="flex items-center text-gray-600 text-xs">
                  <Separator orientation="vertical" className="mx-2 h-3 bg-gray-200 ml-0" />
                  <span className="line-clamp-1">{auction.location}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Location info for non-vehicle items */}
          {!isVehicleItem && auction.location && (
            <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
              <div className="flex items-center text-gray-600 text-xs">
                <span className="line-clamp-1">{auction.location}</span>
              </div>
            </div>
          )}
          
          {/* Price section - more prominent with better hierarchy */}
          <div className={`flex items-center flex-wrap gap-2 ${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
            <span className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-xl'} leading-none`}>
              {formatCurrency(auction.currentBid)}
            </span>
            {auction.originalPrice && (
              <div className="flex items-center gap-2">
                {discount && (
                  <span className="bg-accent2-50 text-accent2-700 px-2 py-0.5 rounded-md text-xs font-medium">
                    {discount}% OFF
                  </span>
                )}
                <span className="text-gray-500 line-through text-xs">
                  {formatCurrency(auction.originalPrice)}
                </span>
              </div>
            )}
          </div>
          
          {/* Subtle divider with precisely 12px margin below */}
          <Separator className={`${isMobile ? 'mb-2 mt-1' : 'mb-3 mt-1'} bg-gray-100`} />
          
          {/* Bottom row with consistent 12px spacing from separator */}
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-1.5 flex-shrink min-w-0 overflow-hidden">
              <Badge variant="outline" className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded`}>
                {auction.origin}
              </Badge>
              <Badge variant="outline" className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded`}>
                {auction.place}
              </Badge>
            </div>
            <div className={`flex items-center bg-gray-50 rounded-md ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'} text-gray-700 font-medium ${isMobile ? 'text-xs' : 'text-xs'} whitespace-nowrap flex-shrink-0`}>
              <Calendar size={isMobile ? 10 : 12} className="mr-1 text-gray-500" />
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
