
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import MobileNavBar from '@/components/MobileNavBar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Verificar se estamos em uma rota de autenticação
  const isAuthRoute = location.pathname.startsWith('/auth/');
  
  // Se for uma rota de autenticação, apenas renderize o conteúdo sem o layout
  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex">
      <Sidebar />
      <div className="flex-1 pl-0 sm:pl-16">
        <div className="max-w-7xl mx-auto sm:px-6 py-[24px] px-0">
          <main className={isMobile ? "pb-28" : "pb-20"}>
            {children}
          </main>
        </div>
      </div>
      {isMobile && <MobileNavBar />}
    </div>
  );
};

export default AppLayout;
