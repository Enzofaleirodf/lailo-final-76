
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
  
  // Check if we're on an auth route
  const isAuthRoute = location.pathname.startsWith('/auth/');
  
  // If on auth route, render only the content without layout
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Get device type from boolean
  const deviceType: DeviceType = isMobile ? 'mobile' : 'desktop';

  // Get responsive padding classes
  const paddingClasses = getPaddingClasses(deviceType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 overflow-x-hidden w-full">
      <div className="flex w-full relative">
        <Sidebar />
        <div className="flex-1 w-full overflow-x-hidden">
          <div className={`max-w-7xl mx-auto w-full ${paddingClasses}`}>
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
