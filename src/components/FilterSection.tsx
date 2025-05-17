
import React, { useState } from 'react';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Filter, FilterX, Building2, Car, X } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plane, Truck, Tractor, Bike, Ship, Bus } from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import TopFilters from './TopFilters';

const FilterContent = () => {
  // State to track which filter sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    vehicleType: true,
    model: true,
    color: true,
    year: true,
    price: true
  });

  // Function to toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter section component with toggle
  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string, 
    section: keyof typeof expandedSections, 
    children: React.ReactNode 
  }) => (
    <div className="mb-6 border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
      <button 
        onClick={() => toggleSection(section)} 
        className="w-full flex justify-between items-center bg-gradient-to-r from-purple-50 to-white p-4 cursor-pointer"
      >
        <h3 className="text-sm font-medium text-purple-900">{title}</h3>
        <ChevronDown 
          size={18} 
          className={cn(
            "text-purple-700 transition-transform", 
            expandedSections[section] ? "transform rotate-180" : ""
          )} 
        />
      </button>
      
      {expandedSections[section] && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="flex flex-col gap-3">
      <FilterSection title="Localização" section="location">
        <div className="relative">
          <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="">
            <option value="" disabled>Selecione</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </FilterSection>

      <FilterSection title="Tipo de veículo" section="vehicleType">
        <ToggleGroup type="multiple" className="flex flex-wrap gap-2 w-full justify-start">
          <ToggleGroupItem value="aereos" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Plane size={14} />
            <span>Aéreos</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="carros" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Car size={14} />
            <span>Carros</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="caminhoes" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Truck size={14} />
            <span>Caminhões</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="maquinas" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Tractor size={14} />
            <span>Maquinas</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="micromobilidade" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Car size={14} />
            <span>Micromobilidade</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="motos" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Bike size={14} />
            <span>Motos</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="nauticos" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Ship size={14} />
            <span>Naúticos</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="onibus" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Bus size={14} />
            <span>Ônibus</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="reboques" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Truck size={14} />
            <span>Reboques</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="tratores" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
            <Tractor size={14} />
            <span>Tratores</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </FilterSection>

      <FilterSection title="Marca e Modelo" section="model">
        <div className="space-y-3">
          <div className="relative">
            <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="todas">
              <option value="todas">Todas as marcas</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
          <div className="relative">
            <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="todos">
              <option value="todos">Todos os modelos</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Cor" section="color">
        <div className="relative">
          <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="">
            <option value="" disabled>Selecione</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </FilterSection>

      <FilterSection title="Ano" section="year">
        <div className="flex gap-2">
          <Input type="text" placeholder="Ano mínimo" className="h-10 text-sm" />
          <Input type="text" placeholder="Ano máximo" className="h-10 text-sm" />
        </div>
      </FilterSection>

      <FilterSection title="Valor do lance" section="price">
        <div className="space-y-4">
          <div className="mb-4">
            <Slider defaultValue={[30]} max={100} step={1} className="my-4" />
          </div>
          <div className="flex gap-2">
            <Input type="text" placeholder="Valor mínimo" className="h-10 text-sm" />
            <Input type="text" placeholder="Valor máximo" className="h-10 text-sm" />
          </div>
        </div>
      </FilterSection>

      <div className="mt-2">
        <Button 
          variant="outline" 
          className="w-full h-10 text-sm font-normal border-gray-200 bg-white hover:bg-gray-50 hover:text-purple-700 transition-colors"
        >
          Resetar filtros
        </Button>
      </div>
    </div>
  );
};

const FilterSection = ({ isOpen, onOpenChange }: { isOpen?: boolean, onOpenChange?: (open: boolean) => void }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Sync local state with parent state if provided
  React.useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState);
    if (onOpenChange) {
      onOpenChange(newOpenState);
    }
  };
  
  // For desktop (large screens), render the sidebar directly
  if (!isMobile) {
    return (
      <div className="w-full lg:w-[448px] bg-gradient-to-br from-white to-purple-50 rounded-lg border border-gray-200 p-6 flex flex-col shadow-sm">
        <FilterContent />
      </div>
    );
  }
  
  // For mobile and tablet screens, use a drawer
  return (
    <>
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="p-0 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-purple-600 text-white border-b border-purple-700">
            <h2 className="text-lg font-medium">Filtros</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-white hover:bg-purple-700" 
              onClick={() => handleOpenChange(false)}
            >
              <X size={20} />
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4">
            {/* Mobile Top Filters */}
            <div className="mb-6">
              <div className="flex gap-0 bg-white rounded-lg border border-gray-200 overflow-hidden h-12 shadow-sm mb-4">
                <button className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm font-medium flex-1">
                  <Building2 size={16} />
                  Imóveis
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600 text-white flex-1">
                  <Car size={16} />
                  Veículos
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <button className="w-full border rounded-lg h-10 px-4 flex items-center justify-between bg-white shadow-sm hover:bg-gray-50">
                  <span className="text-sm">Formato: Leilão</span>
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </button>
                <button className="w-full border rounded-lg h-10 px-4 flex items-center justify-between bg-white shadow-sm hover:bg-gray-50">
                  <span className="text-sm">Origem: Todas</span>
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </button>
                <button className="w-full border rounded-lg h-10 px-4 flex items-center justify-between bg-white shadow-sm hover:bg-gray-50">
                  <span className="text-sm">Praça: Todas</span>
                  <ChevronDown size={16} className="ml-2 text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Filter Content */}
            <FilterContent />
            
            <div className="sticky bottom-0 pt-4 pb-6 bg-gray-50 mt-4">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 bg-white border-gray-300"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleOpenChange(false)}
                >
                  Aplicar filtros
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterSection;
