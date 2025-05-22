
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useResponsiveConsistency } from '@/hooks/useResponsiveConsistency';
import { measurePerformance } from '@/utils/performanceUtils';

interface PerformanceMetric {
  name: string;
  value: number;
  threshold: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
}

/**
 * Componente de monitoramento de desempenho e consistência visual
 * Útil durante testes e desenvolvimento
 */
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [fps, setFps] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(enabled);
  const isMobile = useMediaQuery('mobile');
  
  // Usar hook de consistência com modo de teste ativado
  const { 
    inconsistencies, 
    testAllScreenSizes 
  } = useResponsiveConsistency({ 
    targetElements: [
      { selector: '.test-component', properties: ['font-size', 'margin'] }
    ],
    logInconsistencies: enabled,
    testMode: enabled
  });
  
  // Monitorar FPS
  useEffect(() => {
    if (!enabled || !isVisible) return;
    
    let frameCount = 0;
    let lastTimestamp = performance.now();
    
    const countFrame = () => {
      frameCount++;
      requestAnimationFrame(countFrame);
    };
    
    const calculateFps = () => {
      const now = performance.now();
      const elapsed = now - lastTimestamp;
      
      if (elapsed >= 1000) {
        setFps(Math.round((frameCount * 1000) / elapsed));
        frameCount = 0;
        lastTimestamp = now;
      }
    };
    
    const fpsInterval = setInterval(calculateFps, 500);
    const frameCounter = requestAnimationFrame(countFrame);
    
    return () => {
      cancelAnimationFrame(frameCounter);
      clearInterval(fpsInterval);
    };
  }, [enabled, isVisible]);
  
  // Monitorar métricas de desempenho
  useEffect(() => {
    if (!enabled || !isVisible) return;
    
    const checkPerformanceMetrics = () => {
      // Medir tempo de renderização
      const renderMeasure = measurePerformance("Renderização");
      
      // Forçar nova medição (simulação)
      setTimeout(() => {
        const renderTime = renderMeasure.end();
        
        // Medir operações DOM
        const domMeasure = measurePerformance("Operações DOM", 8);
        document.querySelectorAll('button').forEach(el => el.getBoundingClientRect());
        const domTime = domMeasure.end();
        
        setMetrics([
          { name: "Renderização", value: renderTime, threshold: 16 },
          { name: "Operações DOM", value: domTime, threshold: 8 },
          { name: "Consistência", value: inconsistencies.length, threshold: 0 }
        ]);
      }, 100);
    };
    
    const intervalId = setInterval(checkPerformanceMetrics, 2000);
    
    return () => clearInterval(intervalId);
  }, [enabled, isVisible, inconsistencies.length]);
  
  // Tecla de atalho para alternar visibilidade
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F8' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
      
      // Tecla para executar teste de tamanhos de tela
      if (e.key === 'F9' || (e.ctrlKey && e.key === 't')) {
        e.preventDefault();
        testAllScreenSizes();
      }
    };
    
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (enabled) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [enabled, testAllScreenSizes]);
  
  if (!enabled || !isVisible) {
    return null;
  }
  
  return (
    <div 
      className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white p-2 rounded-lg text-xs shadow-lg"
      style={{ maxWidth: isMobile ? '180px' : '250px' }}
    >
      <div className="flex justify-between items-center mb-2 border-b border-white/20 pb-1">
        <h3 className="font-bold">Monitor de Desempenho</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white"
          aria-label="Fechar monitor"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={fps < 30 ? 'text-red-400' : fps < 55 ? 'text-yellow-400' : 'text-green-400'}>
            {fps}
          </span>
        </div>
        
        {metrics.map(metric => (
          <div key={metric.name} className="flex justify-between">
            <span>{metric.name}:</span>
            <span className={metric.value > metric.threshold ? 'text-red-400' : 'text-green-400'}>
              {metric.value.toFixed(1)} {metric.name === "Consistência" ? '' : 'ms'}
            </span>
          </div>
        ))}
        
        <div className="flex justify-between border-t border-white/20 pt-1 mt-1">
          <span>Dispositivo:</span>
          <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
        </div>
        
        <div className="text-xs text-gray-400 mt-1">
          Use Ctrl+P para alternar visibilidade<br />
          Ctrl+T para testar todos os tamanhos
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
