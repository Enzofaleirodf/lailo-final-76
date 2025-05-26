import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AccessibilityAudit from '@/components/AccessibilityAudit';
import { clearLocalStorage } from '@/services/localStorageService';
import ErrorBoundary from '@/components/ErrorBoundary';

const DevTools: React.FC = () => {
  const clearLocalStorage = () => {
    clearLocalStorage();
    alert('LocalStorage limpo!');
  };
}