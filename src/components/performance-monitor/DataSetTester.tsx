
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { processLargeDataSet, measurePerformance } from '@/utils/performanceUtils';
import { useToast } from '@/hooks/use-toast';

interface DataSetTesterProps {
  enabled?: boolean;
}

/**
 * Componente para teste de desempenho com grandes conjuntos de dados
 * Útil para verificação de desempenho com diferentes tamanhos de dados
 */
const DataSetTester: React.FC<DataSetTesterProps> = ({ enabled = false }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{size: number, time: number}[]>([]);
  const { toast } = useToast();
  
  // Gerar conjunto de dados de teste
  const generateTestData = (size: number) => {
    const data = [];
    for (let i = 0; i < size; i++) {
      data.push({
        id: `item-${i}`,
        name: `Item ${i}`,
        value: Math.random() * 1000,
        active: Math.random() > 0.5,
        tags: Array(Math.floor(Math.random() * 5) + 1)
          .fill(0)
          .map((_, index) => `tag-${index}`)
      });
    }
    return data;
  };
  
  // Função para processar os dados de teste
  const processItem = (item: any) => {
    // Simular algum processamento
    const processed = {
      ...item,
      valueFormatted: `R$ ${item.value.toFixed(2)}`,
      isRelevant: item.value > 500,
      score: item.active ? item.value * 1.2 : item.value * 0.8
    };
    
    return processed;
  };
  
  // Executar teste com diferentes tamanhos de dados
  const runTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setResults([]);
    
    const testSizes = [100, 500, 1000, 5000];
    const newResults = [];
    
    toast({
      title: "Teste de desempenho iniciado",
      description: `Testando ${testSizes.length} conjuntos de dados`,
      duration: 2000
    });
    
    for (const size of testSizes) {
      // Gerar dados de teste
      const testData = generateTestData(size);
      
      // Medir desempenho
      const perf = measurePerformance(`Processando ${size} itens`);
      
      // Processar dados
      const processed = await processLargeDataSet(
        testData,
        processItem,
        Math.min(100, Math.floor(size / 10)), // Tamanho do chunk
        size > 1000 ? 10 : 0 // Adicionar delay para conjuntos maiores
      );
      
      // Registrar resultado
      const time = perf.end();
      console.log(`Tempo para processar ${size} itens: ${time.toFixed(2)}ms`);
      
      newResults.push({ size, time });
      setResults([...newResults]);
      
      // Pequena pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    toast({
      title: "Teste de desempenho concluído",
      description: `Resultados disponíveis no console`,
      duration: 3000
    });
    
    setIsRunning(false);
  };
  
  if (!enabled) {
    return null;
  }
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-3">Teste de Desempenho - Conjuntos de Dados</h3>
      
      <Button
        onClick={runTest}
        disabled={isRunning}
        className="mb-4"
      >
        {isRunning ? 'Executando teste...' : 'Executar teste de desempenho'}
      </Button>
      
      {results.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-2">Resultados:</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Tamanho</th>
                <th className="text-left p-2">Tempo (ms)</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ size, time }) => (
                <tr key={size} className="border-b">
                  <td className="p-2">{size} itens</td>
                  <td className="p-2">{time.toFixed(2)} ms</td>
                  <td className="p-2">
                    <span 
                      className={`inline-block w-3 h-3 rounded-full ${
                        time > 1000 ? 'bg-red-500' : 
                        time > 500 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                    ></span>
                    <span className="ml-2">
                      {time > 1000 ? 'Lento' : 
                       time > 500 ? 'Moderado' : 
                       'Rápido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="text-xs text-gray-500 mt-3">
            <p>Valores desejáveis:</p>
            <ul className="list-disc pl-5">
              <li>Conjuntos pequenos (100): &lt; 50ms</li>
              <li>Conjuntos médios (500-1000): &lt; 200ms</li>
              <li>Conjuntos grandes (&gt;1000): Processamento em chunks</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSetTester;
