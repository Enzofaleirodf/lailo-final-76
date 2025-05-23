
import React, { useState } from 'react';
import { Home, Search, Heart, Gavel, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LightLogin } from '@/components/ui/sign-in';
import { useAuth } from '@/hooks/useAuth';
import UserAvatar from './UserAvatar';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  // Check if the path starts with the given route
  const isActiveRoute = (route: string) => {
    if (route === '/' && location.pathname === '/') return true;
    if (route !== '/' && location.pathname.startsWith(route)) return true;
    return false;
  };
  
  // Mobile sidebar with header and hamburger icon
  if (isMobile) {
    return null; // No sidebar on mobile, we use MobileNavBar instead
  }
  
  // Handler for protected navigation
  const handleProtectedNavigation = (e: React.MouseEvent, to: string) => {
    if (!isAuthenticated && to.startsWith('/favoritos')) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };
  
  // Desktop sidebar
  return (
    <>
      <div 
        className={cn(
          "h-full bg-gradient-to-b from-brand-800 to-brand-900 border-r border-brand-700/50 flex flex-col items-center py-6 fixed left-0 top-0 z-50 transition-all duration-300 shadow-lg",
          expanded ? "w-48" : "w-16"
        )}
      >
        <div className="mb-8 flex justify-center w-full px-3">
          <button 
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-700/50 hover:bg-brand-700 transition-colors"
          >
            <Menu size={20} className="text-white" />
          </button>
        </div>
        
        <TooltipProvider delayDuration={300}>
          <div className="flex flex-col items-center gap-6 w-full">
            <NavButton 
              icon={Home} 
              label="Início" 
              to="/" 
              expanded={expanded} 
              isActive={isActiveRoute('/')} 
            />
            <NavButton 
              icon={Search} 
              label="Buscador" 
              to="/buscador" 
              expanded={expanded} 
              isActive={isActiveRoute('/buscador')} 
            />
            <ProtectedNavButton 
              icon={Heart} 
              label="Favoritos" 
              to="/favoritos" 
              expanded={expanded} 
              isActive={isActiveRoute('/favoritos')} 
              onClick={handleProtectedNavigation}
            />
            <NavButton 
              icon={Gavel} 
              label="Leiloeiros" 
              to="/leiloeiros" 
              expanded={expanded} 
              isActive={isActiveRoute('/leiloeiros')} 
            />
          </div>
        
          <div className="mt-auto flex flex-col items-center gap-6 w-full">
            <NavButton 
              icon={UserAvatar} 
              label="Perfil" 
              to="/perfil" 
              expanded={expanded} 
              isActive={isActiveRoute('/perfil')}
              isAvatar={true}
            />
          </div>
        </TooltipProvider>
      </div>
      
      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="p-0 border-none max-w-md">
          <LightLogin />
        </DialogContent>
      </Dialog>
    </>
  );
};

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  to: string;
  expanded: boolean;
  isActive?: boolean;
  isAvatar?: boolean;
  onClick?: (e: React.MouseEvent, to: string) => void;
}

const NavButton = ({ icon: Icon, label, to, expanded, isActive = false, isAvatar = false, onClick }: NavButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e, to);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link 
          to={to}
          className={cn(
            "w-full flex items-center px-3 py-3 transition-all rounded-md mx-1",
            expanded ? "justify-start" : "justify-center",
            isActive 
              ? "text-white bg-brand-600 shadow-md" 
              : "text-brand-200 hover:text-white hover:bg-brand-700/50"
          )}
          onClick={handleClick}
        >
          {isAvatar ? (
            <UserAvatar />
          ) : (
            <Icon size={20} />
          )}
          {expanded && (
            <span className="ml-3 text-sm font-medium truncate">{label}</span>
          )}
        </Link>
      </TooltipTrigger>
      {!expanded && (
        <TooltipContent side="right" className="bg-brand-800 text-white border-brand-700">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

// Special component for protected routes
const ProtectedNavButton = (props: NavButtonProps) => {
  return <NavButton {...props} />;
};

export default Sidebar;
