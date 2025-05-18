
import React from 'react';
import { Plane, Car, Truck, Tractor, Bike, Ship, Bus } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const VehicleTypeFilter = () => {
  return (
    <div className="flex flex-wrap gap-2 w-full justify-start">
      <ToggleGroup type="multiple" className="flex flex-wrap gap-2 w-full justify-start">
        <ToggleGroupItem value="aereos" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Plane size={14} />
          <span>Aéreos</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="carros" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Car size={14} />
          <span>Carros</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="caminhoes" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Truck size={14} />
          <span>Caminhões</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="maquinas" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Tractor size={14} />
          <span>Maquinas</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="micromobilidade" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Car size={14} />
          <span>Micromobilidade</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="motos" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Bike size={14} />
          <span>Motos</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="nauticos" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Ship size={14} />
          <span>Naúticos</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="onibus" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Bus size={14} />
          <span>Ônibus</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="reboques" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Truck size={14} />
          <span>Reboques</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="tratores" className="h-8 rounded-full px-3 border text-sm flex items-center gap-1 bg-white hover:bg-purple-50 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-800 data-[state=on]:border-purple-300">
          <Tractor size={14} />
          <span>Tratores</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default VehicleTypeFilter;
