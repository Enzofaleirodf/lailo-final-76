
import React from 'react';
import { AuctionItem } from '@/types/auction';
import { PropertyItem } from '@/types/property';

// Lazy loading para componentes pesados
const AuctionCard = React.lazy(() => import('@/components/AuctionCard'));
const PropertyCard = React.lazy(() => import('@/components/PropertyCard'));

interface LazyCardProps {
  item: AuctionItem | PropertyItem;
  contentType: 'auction' | 'property';
}

/**
 * Wrapper para carregamento lazy dos cards
 */
const LazyAuctionCard: React.FC<LazyCardProps> = ({ item, contentType }) => {
  return (
    <React.Suspense 
      fallback={
        <div className="h-48 bg-gray-100 animate-pulse rounded-lg border" />
      }
    >
      {contentType === 'property' ? (
        <PropertyCard property={item as PropertyItem} />
      ) : (
        <AuctionCard auction={item as AuctionItem} />
      )}
    </React.Suspense>
  );
};

export default React.memo(LazyAuctionCard);
