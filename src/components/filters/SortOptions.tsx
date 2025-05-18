
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface SortOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOption: string;
  onSortChange: (value: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  open,
  onOpenChange,
  selectedOption,
  onSortChange
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'price-asc', label: 'Menor preço' },
    { value: 'price-desc', label: 'Maior preço' },
    { value: 'highest-discount', label: 'Maior desconto' },
    { value: 'nearest', label: 'Mais próximos' }
  ];

  const handleSortChange = (value: string) => {
    onSortChange(value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle>Ordenar por</DialogTitle>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                aria-label="Fechar"
              >
                <X size={18} />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="p-4">
          <RadioGroup value={selectedOption} onValueChange={handleSortChange}>
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SortOptions;
