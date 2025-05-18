import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
const ResultHeader = () => {
  const isMobile = useIsMobile();
  return <div className="flex justify-between items-center mb-6 px-[16px]">
      <div className="text-sm text-gray-600">
        Encontramos 270 leilões em 28 sites · 13 novos hoje
      </div>
      {!isMobile && <div className="relative border rounded-md h-9 px-3 flex items-center cursor-pointer">
          <span className="text-sm mr-2">Ordenar</span>
          <ChevronDown size={15} className="text-gray-400" />
        </div>}
    </div>;
};
export default ResultHeader;