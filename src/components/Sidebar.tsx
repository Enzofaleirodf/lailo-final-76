
import React, { useState } from 'react';
import { Home, Search, Heart, Building2, Bell, User, Menu, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  // Mobile sidebar with header and hamburger icon
  if (isMobile) {
    return (
      // This is just a placeholder for the space the fixed sidebar would take
      <div className="w-0"></div>
    );
  }
  
  // Desktop sidebar
  return (
    <div 
      className={cn(
        "h-full bg-gradient-to-b from-brand-800 to-brand-900 border-r border-brand-700/50 flex flex-col items-center py-6 fixed left-0 top-0 z-10 transition-all duration-300 shadow-lg",
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
          <NavButton icon={Home} label="Home" expanded={expanded} />
          <NavButton icon={Search} label="Search" expanded={expanded} />
          <NavButton icon={Heart} label="Favorites" expanded={expanded} />
          <NavButton icon={Building2} label="Properties" expanded={expanded} isActive />
        </div>
      
        <div className="mt-auto flex flex-col items-center gap-6 w-full">
          <NavButton icon={Bell} label="Notifications" expanded={expanded} />
          <NavButton icon={User} label="Profile" expanded={expanded} />
        </div>
      </TooltipProvider>
    </div>
  );
};

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  expanded: boolean;
  isActive?: boolean;
}

const NavButton = ({ icon: Icon, label, expanded, isActive = false }: NavButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          className={cn(
            "w-full flex items-center px-3 py-3 transition-all rounded-md mx-1",
            expanded ? "justify-start" : "justify-center",
            isActive 
              ? "text-white bg-brand-600 shadow-md" 
              : "text-brand-200 hover:text-white hover:bg-brand-700/50"
          )}
        >
          <Icon size={20} />
          {expanded && (
            <span className="ml-3 text-sm font-medium truncate">{label}</span>
          )}
        </button>
      </TooltipTrigger>
      {!expanded && (
        <TooltipContent side="right" className="bg-brand-800 text-white border-brand-700">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default Sidebar;
