
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AuctionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-4/5 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        
        <div className="flex justify-between items-end mb-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
};

export default AuctionCardSkeleton;
