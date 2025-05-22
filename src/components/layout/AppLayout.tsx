
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MobileNavBar from '@/components/MobileNavBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPaddingClasses, getDeviceType, DeviceType } from '@/utils/layoutUtils';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Get device type from boolean
  const deviceType: DeviceType = isMobile ? 'mobile' : 'desktop';

  // Get responsive padding classes
  const paddingClasses = getPaddingClasses(deviceType);

  // Precalcular a largura do conteúdo considerando a sidebar fixa
  const sidebarWidth = isMobile ? 0 : 64; // 16rem quando expandida, 4rem quando colapsada (64px)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 overflow-hidden w-full">
      <div className="flex w-full relative">
        {/* Sidebar is always rendered here, not in each page */}
        <Sidebar />
        
        {/* Área de conteúdo com largura ajustada para não sobrepor */}
        <div className="flex-1 overflow-hidden" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <div className={`w-full ${paddingClasses}`}>
            <main className={`w-full ${isMobile ? "pb-24" : "pb-20"}`}>
              {children}
            </main>
          </div>
        </div>
        
        {isMobile && <MobileNavBar />}
      </div>
    </div>
  );
};

export default AppLayout;
