
import React from 'react';
import { AuctionItem } from '@/types/auction';
import BaseCard from './BaseCard';
import { Palette, Hourglass } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuctionCardProps {
  auction: AuctionItem;
}

const AuctionCard: React.FC<AuctionCardProps> = React.memo(({ auction }) => {
  // Guard clause para evitar renderização se auction for undefined
  if (!auction) {
    console.error('AuctionCard received undefined auction data');
    return null;
  }
  
  const isMobile = useIsMobile();

  // Extrair marca e modelo do veículo (sem o ano)
  const getVehicleTitle = () => {
    // Remover qualquer padrão de ano como "2021" do título
    return auction.title.replace(/\s+\d{4}$|\s+\d{4}\s+/, ' ').trim();
  };

  // Verificar se este é um item de veículo e se vehicleInfo existe
  const isVehicleItem = auction.vehicleInfo && (
    auction.vehicleInfo.type === 'car' || 
    auction.vehicleInfo.type === 'motorcycle' || 
    auction.vehicleInfo.type === 'truck'
  );
  
  // Construir o componente de informações extras específico para veículos
  const extraInfo = isVehicleItem && auction.vehicleInfo ? (
    <div className="flex items-center gap-2 flex-wrap mb-1">
      {auction.vehicleInfo.color && (
        <div className="flex items-center">
          <Palette size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" />
          <span>{auction.vehicleInfo.color}</span>
        </div>
      )}
      
      {auction.vehicleInfo.year && (
        <>
          <div className="flex items-center ml-2">
            <Hourglass size={isMobile ? 12 : 14} className="mr-1 text-gray-500 flex-shrink-0" />
            <span>{auction.vehicleInfo.year}</span>
          </div>
          
          {/* Divisor entre ano e localização */}
          <div className="mx-2 h-3 w-[1px] bg-gray-300"></div>
          
          {/* Localização ao lado do ano com divisor entre eles */}
          <span className="">{auction.location || 'Localização não disponível'}</span>
        </>
      )}
    </div>
  ) : <span>Informações não disponíveis</span>;
  
  return (
    <BaseCard 
      id={auction.id}
      title={getVehicleTitle()}
      price={{
        current: auction.currentBid,
        original: auction.originalPrice
      }}
      extraInfo={extraInfo}
      imageUrl={auction.imageUrl}
      location={auction.location}
      origin={auction.origin}
      place={auction.place}
      endDate={auction.endDate}
    />
  );
});

AuctionCard.displayName = 'AuctionCard';
export default AuctionCard;
