import React from 'react';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
const FilterSection = () => {
  return <div className="w-[448px] bg-white rounded-md border p-6 flex flex-col gap-5">
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
    </div>;
};
export default FilterSection;