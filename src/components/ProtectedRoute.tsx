
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LightLogin } from '@/components/ui/sign-in';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // When trying to access a protected route while not authenticated,
  // show login modal instead of redirecting
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  // If authenticated, render the children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, show login modal but don't render the protected content
  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="p-0 border-none max-w-md">
        <LightLogin />
      </DialogContent>
    </Dialog>
  );
};

export default ProtectedRoute;
