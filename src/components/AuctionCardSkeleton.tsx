
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const AuctionCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border border-gray-200">
      <div className="flex flex-col sm:flex-row">
        {/* Left side - image */}
        <div className="w-full sm:w-2/5 lg:w-1/3">
          <div className="aspect-video sm:aspect-square">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
        
        {/* Right side - content */}
        <div className="flex-1 p-4 flex flex-col">
          <Skeleton className="h-6 w-4/5 mb-2" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-full mb-3" />
          
          <div className="flex justify-between items-center mt-auto mb-3">
            <Skeleton className="h-8 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          
          <div className="pt-3 mt-3 border-t border-gray-100">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AuctionCardSkeleton;
