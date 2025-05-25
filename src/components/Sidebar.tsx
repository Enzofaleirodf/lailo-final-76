import React, { useState } from 'react';
import { Building2, Home, Search, Heart, Gavel, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Z_INDEX } from '@/constants/layout';

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'Início',
    href: '/'
  },
  {
    icon: Search,
    label: 'Buscador',
    href: '/buscador'
  },
  {
    icon: Heart,
    label: 'Favoritos',
    href: '/favoritos'
  },
  {
    icon: Gavel,
    label: 'Leiloeiros',
    href: '/leiloeiros'
  }
];

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const path = location.pathname;

  const isActiveRoute = (route: string) => {
    if (route === '/' && path === '/') return true;
    if (route !== '/' && path.startsWith(route)) return true;
    return false;
  };

  return (
    <>
      <div 
        className={cn(
          "h-full bg-gradient-to-b from-brand-800 to-brand-900 border-r border-brand-700/50 flex flex-col items-center py-6 fixed left-0 top-0 transition-all duration-300 shadow-lg",
          expanded ? "w-48" : "w-16"
        )}
        style={{ zIndex: Z_INDEX.SIDEBAR }}
        role="navigation"
        aria-label="Navegação principal"
        aria-expanded={expanded}
      >
        {/* Logo/Brand section */}
        <div className="mb-8">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-brand-600" />
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 w-full" role="list">
          {navItems.map((item, index) => {
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center w-full px-3 py-3 mb-2 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-brand-700 text-white shadow-md" 
                    : "text-brand-200 hover:bg-brand-700/50 hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                role="listitem"
              >
                <div className="flex items-center justify-center w-8">
                  <item.icon 
                    size={20} 
                    className={cn(
                      "transition-colors duration-200",
                      isActive ? "text-white" : "text-brand-200 group-hover:text-white"
                    )} 
                    aria-hidden="true"
                  />
                </div>
                
                {expanded && (
                  <span className="ml-3 text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
                
                {!expanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 p-2 rounded-lg bg-brand-700 text-white hover:bg-brand-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-brand-800"
          aria-label={expanded ? "Recolher menu lateral" : "Expandir menu lateral"}
          aria-expanded={expanded}
        >
          <ChevronLeft 
            size={16} 
            className={cn(
              "transition-transform duration-200",
              expanded ? "rotate-0" : "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
