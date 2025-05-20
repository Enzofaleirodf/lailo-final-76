
import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  id?: string;
  'aria-label'?: string;
  disabled?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  className = "",
  id,
  "aria-label": ariaLabel,
  disabled = false
}) => {
  // Referência para o elemento select
  const selectRef = useRef<HTMLSelectElement>(null);
  
  // Verificar se o valor não está vazio e não é um valor padrão como "Todas", "Todos"
  const isValueSelected = value && value !== "Todas" && value !== "Todos";
  
  // Handler para mudança com prevenção de efeitos colaterais de rolagem
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Capturar a posição de rolagem atual
    const scrollPosition = window.scrollY;
    
    // Chamar o callback de onChange
    onChange(e.target.value);
    
    // Evitar que a mudança cause rolagem
    window.scrollTo({
      top: scrollPosition,
      behavior: 'instant'
    });
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
      
      // Criar elemento aria-live para anúncios
      let announcer = document.getElementById('filter-announcer');
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'filter-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        announcer.style.clip = 'rect(0, 0, 0, 0)';
        document.body.appendChild(announcer);
      }
      
      // Fazer o anúncio
      setTimeout(() => {
        if (announcer) announcer.textContent = announcement;
      }, 100);
    };
    
    select.addEventListener('focus', handleFocus);
    return () => {
      select.removeEventListener('focus', handleFocus);
    };
  }, [ariaLabel, value, options]);
  
  return (
    <div className="relative isolate">
      <select
        ref={selectRef}
        id={id}
        aria-label={ariaLabel}
        className={`w-full border rounded-lg h-10 pl-3 pr-10 text-sm appearance-none bg-white 
          ${isValueSelected ? 'text-brand-700 font-medium' : 'text-gray-700'} 
          focus:outline-none focus:ring-2 focus:ring-accent2-500 focus:border-accent2-500
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'cursor-pointer'}
          ${className}`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ height: '40px' }}
        disabled={disabled}
        role="combobox"
        aria-expanded="false"
        aria-required="false"
        aria-autocomplete="list"
      >
        {placeholder && <option value="" disabled className="text-gray-500 font-normal">{placeholder}</option>}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            className={`${option.value === value ? 'text-brand-700 font-medium' : 'text-gray-700 font-normal'}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={16} 
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${disabled ? 'text-gray-400' : 'text-gray-500'}`} 
        aria-hidden="true"
      />
    </div>
  );
};

export default FilterDropdown;
