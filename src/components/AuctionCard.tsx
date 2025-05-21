import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Palette, Hourglass, MapPin } from 'lucide-react';
import { AuctionItem } from '@/types/auction';
import { formatCurrency } from '@/utils/auctionUtils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";
import FavoriteButton from './FavoriteButton';
interface AuctionCardProps {
  auction: AuctionItem;
}
const AuctionCard: React.FC<AuctionCardProps> = React.memo(({
  auction
}) => {
  // Guard clause to prevent rendering if auction is undefined
  if (!auction) {
    console.error('AuctionCard received undefined auction data');
    return null;
  }
  const [favorited, setFavorited] = useState(false);
  const isMobile = useIsMobile();

  // Calculate discount if original price exists
  const calculateDiscount = () => {
    if (auction.originalPrice && auction.originalPrice > auction.currentBid) {
      const discount = Math.round((auction.originalPrice - auction.currentBid) / auction.originalPrice * 100);
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
  const handleToggleFavorite = (id: string, newFavoritedState: boolean) => {
    setFavorited(newFavoritedState);
  };

  // Extract vehicle brand and model (without year)
  const getVehicleTitle = () => {
    // Remove any year pattern like "2021" from the title
    return auction.title.replace(/\s+\d{4}$|\s+\d{4}\s+/, ' ').trim();
  };

  // Check if this is a vehicle item and that vehicleInfo exists
  const isVehicleItem = auction.vehicleInfo && (auction.vehicleInfo.type === 'car' || auction.vehicleInfo.type === 'motorcycle' || auction.vehicleInfo.type === 'truck');
  return <motion.div whileHover={{
    y: -4,
    transition: {
      duration: 0.2
    }
  }} className={`${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full">
        {/* Content */}
        <div className={`flex flex-col ${isMobile ? 'p-3' : 'p-4'} w-full`}>
          {/* Top row with vehicle title and favorite button */}
          <div className="flex justify-between items-start gap-2 mb-1 w-full  items-center">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 tracking-tight ${isMobile ? 'text-sm leading-tight' : 'text-lg leading-tight'}`}>
              {getVehicleTitle()}
            </h3>
            <FavoriteButton itemId={auction.id} isFavorited={favorited} onToggleFavorite={handleToggleFavorite} />
          </div>
          
          {/* Vehicle info row - only shown for vehicle items with proper null checks */}
          {isVehicleItem && auction.vehicleInfo && <div className={`flex items-center text-gray-600 ${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                {auction.vehicleInfo.color && <div className="flex items-center">
                    <Palette size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" />
                    <span>{auction.vehicleInfo.color}</span>
                  </div>}
                
                {auction.vehicleInfo.year && <>
                    <div className="flex items-center ml-2">
                      <Hourglass size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" />
                      <span>{auction.vehicleInfo.year}</span>
                    </div>
                    
                    {/* Divider between year and location */}
                    <div className="mx-2 h-3 w-[1px] bg-gray-300"></div>
                    
                    {/* Location next to year with divider between them */}
                    <span>{auction.location || 'Localização não disponível'}</span>
                  </>}
              </div>
            </div>}
          
          {/* Price section */}
          <div className={`flex items-center flex-wrap gap-2 ${isMobile ? 'mb-2' : 'mb-3'} w-full`}>
            <span className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-xl'} leading-none`}>
              {formatCurrency(auction.currentBid)}
            </span>
            {auction.originalPrice && <div className="flex items-center gap-2">
                {discount && <span className="bg-accent2-400 px-2 py-0.5 rounded-md text-xs font-medium text-inherit">
                    {discount}% OFF
                  </span>}
                <span className="text-gray-500 line-through text-xs">
                  {formatCurrency(auction.originalPrice)}
                </span>
              </div>}
          </div>
          
          {/* Subtle divider */}
          <Separator className={`${isMobile ? 'mb-2 mt-1' : 'mb-3 mt-1'} bg-gray-100`} />
          
          {/* Bottom row with auction details */}
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-1.5 flex-shrink min-w-0 overflow-hidden">
              <Badge variant="outline" className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded font-urbanist`}>
                {auction.origin || 'Origem não disponível'}
              </Badge>
              <Badge variant="outline" className={`bg-gray-50 text-gray-700 font-normal border-gray-200 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'} rounded font-urbanist`}>
                {auction.place || 'Praça não disponível'}
              </Badge>
            </div>
            <div className={`flex items-center bg-gray-50 rounded-md ${isMobile ? 'px-1.5 py-0.5' : 'px-2 py-1'} text-gray-700 font-medium ${isMobile ? 'text-xs' : 'text-xs'} whitespace-nowrap flex-shrink-0`}>
              <Calendar size={isMobile ? 10 : 12} className="mr-1 text-gray-500" />
              {auction.endDate ? `${formatAuctionDate(auction.endDate)} às ${formatEndTime(auction.endDate)}` : 'Data não disponível'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
});
AuctionCard.displayName = 'AuctionCard';
export default AuctionCard;