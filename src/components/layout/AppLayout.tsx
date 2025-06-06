
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MobileNavBar from '@/components/MobileNavBar';
import ErrorBoundary from '@/components/ErrorBoundary';
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

  return (
    <ErrorBoundary componentName="AppLayout">
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 overflow-x-hidden w-full">
        <div className="flex w-full relative">
          {/* Sidebar is always rendered here, not in each page */}
          <Sidebar />
          
          {/* Main content area with responsive margin for sidebar */}
          <div className={`flex-1 w-full overflow-x-hidden transition-all duration-300 ${!isMobile ? 'ml-16' : ''}`}>
            <div className={`max-w-7xl mx-auto w-full ${paddingClasses}`}>
              <main className={`w-full ${isMobile ? "pb-20" : "pb-8"}`}>
                <ErrorBoundary componentName="AppLayout-Content">
                  {children}
                </ErrorBoundary>
              </main>
            </div>
          </div>
          
          {/* Mobile navigation bar */}
          {isMobile && <MobileNavBar />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;
