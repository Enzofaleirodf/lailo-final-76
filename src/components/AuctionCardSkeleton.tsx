
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const AuctionCardSkeleton: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div className="mb-2">
      <div className="flex p-3 rounded-xl bg-white border border-[#E5E5E5] shadow-sm">
        {/* Left side - image */}
        <div className="relative w-[30%] min-w-[96px]">
          <div className="relative h-full w-full flex">
            <div className="flex-1 relative overflow-hidden rounded-lg">
              <Skeleton className="h-full w-full" style={{ aspectRatio: '4/3' }} />
            </div>
          </div>
        </div>
        
        {/* Right side - content */}
        <div className="flex-1 pl-3 flex flex-col">
          <Skeleton className={`${!isMobile ? 'h-[20px]' : 'h-5'} w-4/5 mb-2`} />
          <Skeleton className={`${!isMobile ? 'h-[17px]' : 'h-4'} w-2/3 mb-3`} />
          
          <Skeleton className={`${!isMobile ? 'h-[20px]' : 'h-5'} w-24 mt-2`} />
          
          <div className="border-t border-[#E5E5EA] mt-4 mb-4"></div>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-2">
              <Skeleton className={`${!isMobile ? 'h-[16px]' : 'h-5'} w-16`} />
              <Skeleton className={`${!isMobile ? 'h-[16px]' : 'h-5'} w-16`} />
            </div>
            <Skeleton className={`${!isMobile ? 'h-[16px]' : 'h-5'} w-24`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCardSkeleton;
