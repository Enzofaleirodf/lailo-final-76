
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ResultHeaderProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ResultHeader = ({ isOpen, onOpenChange }: ResultHeaderProps = {}) => {
  const [sortOption, setSortOption] = React.useState('Relevância');
  
  const handleSortSelection = (option: string) => {
    setSortOption(option);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-sm text-gray-600">
        Encontramos 270 leilões em 28 sites · 13 novos hoje
      </div>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <div className="relative border rounded-md h-9 px-3 flex items-center cursor-pointer hover:bg-gray-50">
            <span className="text-sm mr-2">Ordenar: {sortOption}</span>
            <ChevronDown size={15} className="text-gray-400" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={() => handleSortSelection('Relevância')}>
            Relevância
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortSelection('Menor Preço')}>
            Menor Preço
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortSelection('Maior Preço')}>
            Maior Preço
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortSelection('Data (mais recente)')}>
            Data (mais recente)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortSelection('Data (mais antiga)')}>
            Data (mais antiga)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ResultHeader;
