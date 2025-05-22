
import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  id?: string;
  'aria-label'?: string;
  disabled?: boolean;
  placeholder?: string;
  isActive?: boolean;
}

/**
 * Componente de dropdown para filtros 
 * Implementa comportamentos consistentes e acessíveis para desktop e mobile
 */
const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  className = "",
  id,
  "aria-label": ariaLabel,
  disabled = false,
  placeholder,
  isActive = false
}) => {
  // Referências para o elemento select
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isTouched, setIsTouched] = useState(false);
  
  // Verificar se o valor não está vazio e não é um valor padrão como "Todas", "Todos"
  const isValueSelected = value && value !== "todas" && value !== "Todas" && value !== "todos" && value !== "Todos";
  
  // Handler para mudança com prevenção de efeitos colaterais de rolagem
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Capturar a posição de rolagem atual
    const scrollPosition = window.scrollY;
    
    // Marcar como tocado
    setIsTouched(true);
    
    // Chamar o callback de onChange
    onChange(e.target.value);
    
    // Evitar que a mudança cause rolagem
    window.scrollTo({
      top: scrollPosition,
      behavior: 'auto'
    });
    
    // Anunciar mudança para leitores de tela
    const selectedOption = options.find(opt => opt.value === e.target.value);
    announceChange(selectedOption?.label || e.target.value);
  };
  
  // Melhorar acessibilidade para eventos de teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    // Garantir que a seleção via teclado não cause efeitos colaterais
    if (e.key === 'Enter' || e.key === ' ') {
      // Impedir comportamento padrão para evitar rolagem
      e.preventDefault();
      
      // Abrir o dropdown nativo ao pressionar Enter ou espaço
      if (selectRef.current) {
        selectRef.current.click();
      }
    }
  };
  
  // Anunciar mudanças para leitores de tela
  const announceChange = (value: string) => {
    const announcement = `${ariaLabel || 'Filtro'} alterado para ${value}`;
    
    // Usar região live existente ou criar uma nova
    let liveRegion = document.getElementById('dropdown-announcer');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'dropdown-announcer';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    
    // Atualizar o texto após um curto delay para garantir que será lido
    setTimeout(() => {
      if (liveRegion) liveRegion.textContent = announcement;
    }, 100);
  };
  
  // Melhorar foco no componente para leitores de tela
  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;
    
    // Adicionar anúncio para leitores de tela quando o foco muda
    const handleFocus = () => {
      const selectedOption = options.find(opt => opt.value === value);
      const announcement = selectedOption ? 
        `${ariaLabel || 'Filtro'}, valor atual: ${selectedOption.label}` : 
        `${ariaLabel || 'Filtro'}, nenhuma opção selecionada`;
      
      // Anunciar para leitores de tela
      announceChange(announcement);
    };
    
    select.addEventListener('focus', handleFocus);
    return () => {
      select.removeEventListener('focus', handleFocus);
    };
  }, [ariaLabel, value, options]);
  
  // Para debug - verificar quando isActive muda
  useEffect(() => {
    console.log(`FilterDropdown ${id} - isActive:`, isActive);
  }, [isActive, id]);
  
  return (
    <div className="relative isolate">
      <select
        ref={selectRef}
        id={id || `filter-dropdown-${Math.random().toString(36).substring(2, 9)}`}
        aria-label={ariaLabel}
        className={cn(
          "w-full border rounded-lg h-10 pl-3 pr-10 text-sm appearance-none font-urbanist",
          isValueSelected ? "text-gray-800 font-medium" : "text-gray-600",
          isActive ? "border-purple-300" : "border-gray-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white cursor-pointer",
          className
        )}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        role="combobox"
        aria-expanded="false"
        aria-required="false"
        aria-autocomplete="list"
        tabIndex={disabled ? -1 : 0}
        data-active={isActive ? 'true' : 'false'}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option 
            key={`${option.value}-${option.label}`}
            value={option.value} 
            className={`${option.value === value ? 'text-gray-800 font-medium' : 'text-gray-600 font-normal'} font-urbanist`}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={16} 
        className={cn(
          "absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none",
          disabled ? "text-gray-400" : "text-gray-500"
        )} 
        aria-hidden="true"
      />
      <span className="sr-only" id={`${id}-description`}>
        Pressione Enter ou barra de espaço para abrir as opções de seleção
      </span>
    </div>
  );
};

export default React.memo(FilterDropdown);
