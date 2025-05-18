
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
      <>
        <Sheet>
          <SheetTrigger asChild>
            <button 
              className="fixed top-4 left-4 z-50 p-2 rounded-full bg-purple-700 text-white shadow-lg"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-gradient-to-b from-purple-800 to-purple-900 border-r border-purple-700/50">
            <div className="flex flex-col h-full">
              <div className="p-4 flex items-center justify-between border-b border-purple-700/50">
                <div className="font-bold text-xl text-white">Menu</div>
                <SheetTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-purple-700/50 text-white">
                    <X size={20} />
                  </button>
                </SheetTrigger>
              </div>
              <div className="flex flex-col items-center gap-6 py-6 w-full">
                <NavButton icon={Home} label="Home" expanded={true} />
                <NavButton icon={Search} label="Search" expanded={true} />
                <NavButton icon={Heart} label="Favorites" expanded={true} />
                <NavButton icon={Building2} label="Properties" expanded={true} isActive />
              </div>
              <div className="mt-auto flex flex-col items-center gap-6 w-full pb-6">
                <NavButton icon={Bell} label="Notifications" expanded={true} />
                <NavButton icon={User} label="Profile" expanded={true} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* This is just a placeholder for the space the fixed sidebar would take */}
        <div className="w-0"></div>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <div 
      className={cn(
        "h-full bg-gradient-to-b from-purple-800 to-purple-900 border-r border-purple-700/50 flex flex-col items-center py-6 fixed left-0 top-0 z-10 transition-all duration-300 shadow-lg",
        expanded ? "w-48" : "w-16"
      )}
    >
      <div className="mb-8 flex justify-center items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-purple-700/50 hover:bg-purple-700 transition-colors"
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
              ? "text-white bg-purple-600 shadow-md" 
              : "text-purple-200 hover:text-white hover:bg-purple-700/50"
          )}
        >
          <Icon size={20} />
          {expanded && (
            <span className="ml-3 text-sm font-medium truncate">{label}</span>
          )}
        </button>
      </TooltipTrigger>
      {!expanded && (
        <TooltipContent side="right" className="bg-purple-800 text-white border-purple-700">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default Sidebar;
