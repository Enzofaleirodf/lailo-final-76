
import React from 'react';
import { AuctionItem } from '@/types/auction';
import BaseCard from './BaseCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuctionCardProps {
  auction: AuctionItem;
}

/**
 * Componente responsável por renderizar um card de leilão de veículo
 * Reutiliza o BaseCard para manter consistência visual e comportamental
 * 
 * @param auction - Objeto com informações do veículo em leilão
 * @returns Componente de card de leilão de veículo
 */
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
    <div 
      className="flex items-center gap-1 mb-1"
      aria-label={`Detalhes do veículo: ${auction.vehicleInfo.color || ''} ${auction.vehicleInfo.year || ''}`}
    >
      {auction.vehicleInfo.color && (
        <span>{auction.vehicleInfo.color}</span>
      )}
      
      {auction.vehicleInfo.color && auction.vehicleInfo.year && (
        <span className="mx-1">•</span>
      )}
      
      {auction.vehicleInfo.year && (
        <span>{auction.vehicleInfo.year}</span>
      )}
      
      {((auction.vehicleInfo.color || auction.vehicleInfo.year) && auction.location) && (
        <span className="mx-1">•</span>
      )}
      
      {auction.location && (
        <span>{auction.location || 'Localização não disponível'}</span>
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

// Definir displayName para debugging e React DevTools
AuctionCard.displayName = 'AuctionCard';
export default AuctionCard;
