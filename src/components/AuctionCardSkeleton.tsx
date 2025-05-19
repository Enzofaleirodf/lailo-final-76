
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const AuctionCardSkeleton: React.FC = () => {
  return (
    <motion.div>
      <Card className="flex p-3 overflow-hidden border border-gray-200">
        {/* Left side - image */}
        <div className="w-[30%] min-w-[96px]">
          <AspectRatio ratio={3/4} className="h-full">
            <Skeleton className="w-full h-full rounded-lg" />
          </AspectRatio>
        </div>
        
        {/* Right side - content */}
        <div className="flex-1 pl-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <Skeleton className="h-6 w-4/5 mb-2" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-4 w-2/3 mb-2" />
          </div>
          
          <Skeleton className="h-6 w-24 mt-auto" />
          
          <div className="border-t border-gray-100 my-2"></div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AuctionCardSkeleton;
