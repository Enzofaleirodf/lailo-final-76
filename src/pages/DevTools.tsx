import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PerformanceMonitor from '@/components/performance-monitor/PerformanceMonitor';
import DataSetTester from '@/components/performance-monitor/DataSetTester';
import { useResponsiveConsistency } from '@/hooks/useResponsiveConsistency';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Página de ferramentas de desenvolvimento para testes de desempenho e consistência visual
 */
const DevTools: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { testAllScreenSizes, inconsistencies } = useResponsiveConsistency({ 
    targetElements: [
      { selector: '.visual-test-input', properties: ['height', 'padding'] },
      { selector: '.visual-test-button', properties: ['font-size', 'padding'] }
    ],
    logInconsistencies: true,
    testMode: true
  });
  const { toast } = useToast();
  const isMobile = useMediaQuery('mobile');
  const isTablet = useMediaQuery('tablet');
  const isDesktop = useMediaQuery('desktop');
  
  const handleRunTests = async () => {
    setIsLoading(true);
    toast({
      title: "Testes iniciados",
      description: "Verificando consistência em diferentes tamanhos de tela",
      duration: 2000
    });
    
    try {
      await testAllScreenSizes();
      
      toast({
        title: "Testes concluídos",
        description: `${inconsistencies.length} inconsistências encontradas`,
        duration: 3000
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro nos testes",
        description: "Ocorreu um erro durante os testes",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Grupo de elementos para verificação visual
  const testCases = [
    {
      name: "Campos de entrada",
      items: [
        { id: "range-min", label: "Mínimo", value: "100", prefix: "R$", suffix: "", error: false },
        { id: "range-max", label: "Máximo", value: "500", prefix: "R$", suffix: "", error: false },
        { id: "range-min-error", label: "Mínimo", value: "900", prefix: "", suffix: "", error: true },
        { id: "range-max-error", label: "Máximo", value: "100", prefix: "", suffix: "", error: true },
        { id: "area-min", label: "Área min", value: "50", prefix: "", suffix: "m²", error: false },
        { id: "area-max", label: "Área max", value: "120", prefix: "", suffix: "m²", error: false },
      ]
    },
    {
      name: "Botões",
      items: [
        { id: "btn-primary", label: "Botão primário", variant: "default" },
        { id: "btn-secondary", label: "Botão secundário", variant: "secondary" },
        { id: "btn-outline", label: "Botão outline", variant: "outline" },
      ]
    }
  ];
  
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Ferramentas de Desenvolvimento</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Dispositivo atual</CardTitle>
              <CardDescription>Informações do dispositivo atual</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {isMobile ? "📱 Mobile" : isTablet ? "📱 Tablet" : "💻 Desktop"}
              </p>
              <div className="text-sm text-gray-500 mt-2">
                <p>Largura da tela: {window.innerWidth}px</p>
                <p>Altura da tela: {window.innerHeight}px</p>
                <p>Density: {window.devicePixelRatio}x</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Testes Automatizados</CardTitle>
              <CardDescription>Executar verificações de consistência</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleRunTests} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Executando..." : "Executar testes"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Verifica consistência visual em todos os dispositivos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monitor de Desempenho</CardTitle>
              <CardDescription>Verificar métricas em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Pressione <strong>Ctrl+P</strong> para abrir/fechar o monitor de desempenho.
              </p>
              <p className="text-sm mt-2">
                Use <strong>Ctrl+T</strong> para testar todos os tamanhos de tela.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="visual">
          <TabsList className="mb-4">
            <TabsTrigger value="visual">Testes Visuais</TabsTrigger>
            <TabsTrigger value="performance">Testes de Desempenho</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual">
            <div className="grid grid-cols-1 gap-8">
              {testCases.map(group => (
                <Card key={group.name}>
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      Verifique a consistência visual em diferentes dispositivos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {group.name === "Campos de entrada" ? (
                        group.items.map(item => (
                          <div key={item.id} className="relative">
                            <label htmlFor={item.id} className="block text-sm font-medium mb-1">
                              {item.label}
                            </label>
                            <div className="relative">
                              {item.prefix && (
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                  <span className="text-gray-500">{item.prefix}</span>
                                </div>
                              )}
                              <input
                                id={item.id}
                                type="text"
                                value={item.value}
                                readOnly
                                className={`h-10 px-3 w-full text-sm border ${item.error ? 'border-red-500' : 'border-gray-300'} rounded-md ${item.prefix ? 'pl-10' : ''} ${item.suffix ? 'pr-10' : ''}`}
                                data-testid="visual-test-input"
                              />
                              {item.suffix && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <span className="text-gray-500">{item.suffix}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : group.name === "Botões" ? (
                        group.items.map(item => (
                          <div key={item.id}>
                            <Button
                              variant={item.variant as any}
                              className="w-full"
                              data-testid="visual-test-button"
                            >
                              {item.label}
                            </Button>
                          </div>
                        ))
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <DataSetTester enabled={true} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Performance monitor fica sempre ativo mas invisível até Ctrl+P */}
      <PerformanceMonitor enabled={true} />
    </AppLayout>
  );
};

export default DevTools;
