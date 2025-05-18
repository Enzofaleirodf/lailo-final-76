
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, GavelIcon } from 'lucide-react';
import { AuctionItem } from '@/types/auction';
import { formatCurrency } from '@/utils/auctionUtils';

interface AuctionCardProps {
  auction: AuctionItem;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const daysRemaining = Math.ceil((auction.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getFormatBadgeColor = () => {
    return auction.format === 'Leilão' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700';
  };
  
  const getBidStatusColor = () => {
    if (daysRemaining <= 1) return 'text-red-600';
    if (daysRemaining <= 3) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-md card-shadow">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={auction.imageUrl} 
          alt={auction.title} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <Badge className={`absolute top-3 left-3 ${getFormatBadgeColor()}`}>
          {auction.format}
        </Badge>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{auction.title}</h3>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <MapPin size={14} className="mr-1" />
          <span className="line-clamp-1">{auction.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {auction.description}
        </p>
        
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-gray-500">Lance atual</p>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(auction.currentBid)}</p>
          </div>
          
          <div className="flex items-center">
            <Clock size={16} className={`mr-1 ${getBidStatusColor()}`} />
            <span className={`text-sm font-medium ${getBidStatusColor()}`}>
              {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
            </span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
            <span className="text-xs text-gray-500">{auction.bidCount} lances</span>
          </div>
          
          <Badge variant="outline" className="text-purple-700 border-purple-200 hover:bg-purple-50">
            {auction.vehicleInfo.brand} {auction.vehicleInfo.year}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
