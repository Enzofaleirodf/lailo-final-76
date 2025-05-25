
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AccessibilityAudit from '@/components/AccessibilityAudit';
import ErrorBoundary from '@/components/ErrorBoundary';

const DevTools: React.FC = () => {
  const clearLocalStorage = () => {
    localStorage.clear();
    alert('LocalStorage limpo!');
  };

  const clearSessionStorage = () => {
    sessionStorage.clear();
    alert('SessionStorage limpo!');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Ferramentas de Desenvolvimento</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>Limpar dados armazenados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={clearLocalStorage} variant="outline" className="w-full">
              Limpar LocalStorage
            </Button>
            <Button onClick={clearSessionStorage} variant="outline" className="w-full">
              Limpar SessionStorage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Sistema</CardTitle>
            <CardDescription>Dados sobre o ambiente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
              <p><strong>Resolução:</strong> {window.screen.width}x{window.screen.height}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Navegação</CardTitle>
            <CardDescription>Ferramentas de navegação</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.history.back()} variant="outline" className="w-full mb-2">
              Voltar
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Recarregar Página
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Accessibility</h2>
        <ErrorBoundary componentName="AccessibilityAudit">
          <AccessibilityAudit />
        </ErrorBoundary>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Error Logs</h2>
        <Card>
          <CardHeader>
            <CardTitle>Error Logs</CardTitle>
            <CardDescription>View and manage error logs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                localStorage.removeItem('error_logs');
                alert('Error logs cleared!');
              }} 
              variant="outline" 
              className="w-full mb-2"
            >
              Clear Error Logs
            </Button>
            <div className="mt-4 max-h-60 overflow-auto">
              <pre className="text-xs bg-gray-50 p-4 rounded border">
                {localStorage.getItem('error_logs') || 'No error logs found'}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevTools;
