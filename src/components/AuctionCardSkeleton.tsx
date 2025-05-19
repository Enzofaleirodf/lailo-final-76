
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";

const AuctionCardSkeleton: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div className="mb-3">
      <div className="flex p-4 rounded-xl bg-white border border-[#EAECF0] shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_rgba(16,24,40,0.06)]">
        {/* Left side - image */}
        <div className="relative w-[30%] min-w-[100px]">
          <div className="relative h-full w-full flex">
            <div className="flex-1 relative overflow-hidden rounded-lg">
              <Skeleton className="h-full w-full" style={{ aspectRatio: '4/3' }} />
            </div>
          </div>
        </div>
        
        {/* Right side - content */}
        <div className="flex-1 pl-4 flex flex-col">
          {/* Title skeleton */}
          <div className="flex justify-between items-start">
            <Skeleton className={`${!isMobile ? 'h-[22px]' : 'h-[16px]'} w-4/5 mb-2`} />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          
          {/* Vehicle info skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className={`${!isMobile ? 'h-[15px]' : 'h-[13px]'} w-16 mb-1`} />
            <Skeleton className={`${!isMobile ? 'h-[15px]' : 'h-[13px]'} w-8 mb-1`} />
            <Skeleton className={`${!isMobile ? 'h-[15px]' : 'h-[13px]'} w-24 mb-1`} />
          </div>
          
          {/* Price skeleton */}
          <div className="flex gap-2 mt-3">
            <Skeleton className={`${!isMobile ? 'h-[24px]' : 'h-[18px]'} w-24`} />
            <Skeleton className={`${!isMobile ? 'h-[16px]' : 'h-[14px]'} w-12 mt-1`} />
          </div>
          
          {/* Divider */}
          <Separator className="my-3 bg-gray-100" />
          
          {/* Bottom row skeleton */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-1.5">
              <Skeleton className={`${!isMobile ? 'h-[24px]' : 'h-[20px]'} w-16 rounded-md`} />
              <Skeleton className={`${!isMobile ? 'h-[24px]' : 'h-[20px]'} w-16 rounded-md`} />
            </div>
            <Skeleton className={`${!isMobile ? 'h-[24px]' : 'h-[20px]'} w-24 rounded-md`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCardSkeleton;
