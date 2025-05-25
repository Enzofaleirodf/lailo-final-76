
import React from 'react';
import { Home, Search, Heart, Gavel } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';

const MobileNavBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Check if the path starts with the given route
  const isActiveRoute = (route: string) => {
    if (route === '/' && path === '/') return true;
    if (route !== '/' && path.startsWith(route)) return true;
    return false;
  };

  const navItems = [
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

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center z-50 shadow-md mobile-nav-bar">
      {navItems.map((item, index) => {
        const isActive = isActiveRoute(item.href);
        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive ? "text-brand-600" : "text-gray-500"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
      
      <Link
        to="/perfil"
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          isActiveRoute('/perfil') ? "text-brand-600" : "text-gray-500"
        )}
        aria-current={isActiveRoute('/perfil') ? "page" : undefined}
      >
        <UserAvatar mobile={true} />
        <span className="text-xs mt-1">Perfil</span>
      </Link>
    </div>
  );
};

export default MobileNavBar;
