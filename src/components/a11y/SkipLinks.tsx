
import React from 'react';

/**
 * SkipLinks - Componente que fornece links de acessibilidade para pular 
 * diretamente para áreas principais do conteúdo
 * Segue as melhores práticas de acessibilidade WCAG 2.1
 */
const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-0 focus-within:left-0 focus-within:z-50 focus-within:w-full focus-within:bg-white focus-within:p-4 focus-within:shadow-md">
      <nav aria-label="Links de acesso rápido">
        <ul className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <li>
            <a 
              href="#main-content" 
              className="bg-brand-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Pular para o conteúdo principal
            </a>
          </li>
          <li>
            <a 
              href="#filters-section" 
              className="bg-brand-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Pular para os filtros
            </a>
          </li>
          <li>
            <a 
              href="#footer" 
              className="bg-brand-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Pular para o rodapé
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SkipLinks;
