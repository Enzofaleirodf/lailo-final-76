
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from "@/components/ui/separator";

const AuctionCardSkeleton: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div className="mb-4">
      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Left side - image */}
        <div className="relative w-[35%] min-w-[130px]">
          <div className="relative h-full w-full">
            <Skeleton className="h-full w-full" style={{ aspectRatio: '4/3' }} />
          </div>
        </div>
        
        {/* Right side - content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title skeleton */}
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="w-7 h-7 rounded-full" />
          </div>
          
          {/* Vehicle info skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-20" />
          </div>
          
          {/* Price skeleton */}
          <div className="flex gap-2 mb-3">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-5 w-16 self-center" />
          </div>
          
          {/* Divider */}
          <Separator className="my-3 bg-gray-100" />
          
          {/* Bottom row skeleton */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex gap-1.5">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionCardSkeleton;
