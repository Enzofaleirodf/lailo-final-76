
import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    {
      icon: Home,
      label: 'Início',
      href: '/'
    },
    {
      icon: Search,
      label: 'Buscar',
      href: '/buscar'
    },
    {
      icon: Heart,
      label: 'Favoritos',
      href: '/favoritos'
    },
    {
      icon: User,
      label: 'Perfil',
      href: '/perfil'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-40">
      {navItems.map((item, index) => {
        const isActive = item.href === path;
        return (
          <a
            key={index}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive ? "text-brand-600" : "text-gray-500"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default MobileNavBar;
