
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MobileNavBar from '@/components/MobileNavBar';
import SkipLinks from '@/components/a11y/SkipLinks';
import { useIsMobile } from '@/hooks/use-mobile';
import { getPaddingClasses, getDeviceType, DeviceType } from '@/utils/layoutUtils';
import { Z_INDEX, LAYOUT_DIMENSIONS } from '@/constants/layout';

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

  return (
    <>
      <SkipLinks />
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 overflow-x-hidden w-full">
        <div className="flex w-full relative">
          {/* Sidebar is always rendered here, not in each page */}
          <Sidebar />
          
          {/* Main content area with responsive margin for sidebar */}
          <div 
            className={`flex-1 w-full overflow-x-hidden transition-all duration-300 ${!isMobile ? 'ml-16' : ''}`}
            style={{ minHeight: '100vh' }}
          >
            <div className={`max-w-7xl mx-auto w-full ${paddingClasses}`}>
              <main 
                id="main-content"
                className={`w-full ${isMobile ? "pb-20" : "pb-8"}`}
                role="main"
                aria-label="Conteúdo principal"
                tabIndex={-1}
              >
                {children}
              </main>
            </div>
          </div>
          
          {/* Mobile navigation bar */}
          {isMobile && <MobileNavBar />}
        </div>
      </div>
    </>
  );
};

export default AppLayout;
