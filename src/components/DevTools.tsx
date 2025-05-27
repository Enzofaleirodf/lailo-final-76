
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AccessibilityAudit from '@/components/AccessibilityAudit';
import { clearLocalStorage } from '@/services/localStorageService';
import ErrorBoundary from '@/components/ErrorBoundary';

const DevTools: React.FC = () => {
  const handleClearLocalStorage = () => {
    clearLocalStorage();
    alert('LocalStorage limpo!');
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dev Tools</CardTitle>
          <CardDescription>Ferramentas de desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClearLocalStorage}>
            Limpar LocalStorage
          </Button>
          <AccessibilityAudit />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevTools;
