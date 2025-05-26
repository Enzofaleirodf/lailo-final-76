
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
    <ErrorBoundary componentName="DevTools">
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas de Desenvolvimento</CardTitle>
          <CardDescription>Utilitários para desenvolvimento e depuração</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={handleClearLocalStorage} variant="outline">
              Limpar LocalStorage
            </Button>
            <AccessibilityAudit />
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default DevTools;
