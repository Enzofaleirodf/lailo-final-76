
import React, { useState } from 'react';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Filter, FilterX } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plane, Car, Truck, Tractor, Bike, Ship, Bus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

const FilterContent = () => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-medium mb-2">Localização</h3>
        <div className="relative">
          <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="">
            <option value="" disabled>Selecione</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Tipo de veículo</h3>
        <ToggleGroup type="multiple" className="flex flex-wrap gap-2 w-full justify-start">
          <ToggleGroupItem value="aereos" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Plane size={14} />
            <span>Aéreos</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="carros" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Car size={14} />
            <span>Carros</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="caminhoes" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Truck size={14} />
            <span>Caminhões</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="maquinas" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Tractor size={14} />
            <span>Maquinas</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="micromobilidade" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Car size={14} />
            <span>Micromobilidade</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="motos" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Bike size={14} />
            <span>Motos</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="nauticos" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Ship size={14} />
            <span>Naúticos</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="onibus" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Bus size={14} />
            <span>Ônibus</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="reboques" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Truck size={14} />
            <span>Reboques</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="tratores" className="h-9 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-gray-50">
            <Tractor size={14} />
            <span>Tratores</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Marca e Modelo</h3>
        <div className="relative mb-2">
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

      <div>
        <h3 className="text-sm font-medium mb-2">Cor</h3>
        <div className="relative">
          <select className="w-full border rounded-md h-10 pl-3 pr-10 text-sm appearance-none bg-white" defaultValue="">
            <option value="" disabled>Selecione</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Ano</h3>
        <div className="flex gap-2">
          <Input type="text" placeholder="Ano mínimo" className="h-10 text-sm" />
          <Input type="text" placeholder="Ano máximo" className="h-10 text-sm" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Valor do lance atual</h3>
        <div className="mb-4">
          <Slider defaultValue={[30]} max={100} step={1} className="my-4" />
        </div>
        <div className="flex gap-2">
          <Input type="text" placeholder="Valor mínimo" className="h-10 text-sm" />
          <Input type="text" placeholder="Valor máximo" className="h-10 text-sm" />
        </div>
      </div>

      <div className="mt-2">
        <Button variant="outline" className="w-full h-10 text-sm font-normal border-gray-200">
          Resetar filtros
        </Button>
      </div>
    </div>
  );
};

const FilterSection = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // For large screens, render the sidebar directly
  if (!isMobile) {
    return (
      <div className="w-[448px] bg-white rounded-md border p-6 flex flex-col">
        <FilterContent />
      </div>
    );
  }
  
  // For mobile and tablet screens, use a drawer
  return (
    <>
      <div className="md:hidden w-full mb-4">
        <Button 
          variant="outline" 
          onClick={() => setOpen(true)} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Filter size={16} />
          <span>Filtros</span>
        </Button>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Filtros</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-gray-500" 
              onClick={() => setOpen(false)}
            >
              <FilterX size={16} className="mr-2" />
              Limpar
            </Button>
          </div>
          <FilterContent />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterSection;
