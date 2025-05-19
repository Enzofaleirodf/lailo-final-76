
import { useState, useEffect } from 'react';

// Define interfaces for the data structure
interface State {
  id: number;
  sigla: string;
  nome: string;
}

interface City {
  id: number;
  nome: string;
}

// Cache for the data to avoid unnecessary API calls
const statesCache: State[] = [];
const citiesCache: Record<string, City[]> = {};

// Function to fetch all Brazilian states
export const fetchStates = async (): Promise<State[]> => {
  // Return cached data if available
  if (statesCache.length > 0) {
    return statesCache;
  }

  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
    const data = await response.json();
    
    // Update cache
    statesCache.push(...data);
    
    return data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

// Function to fetch cities for a specific state
export const fetchCitiesByState = async (uf: string): Promise<City[]> => {
  // Return cached data if available
  if (citiesCache[uf]) {
    return citiesCache[uf];
  }

  // Handle empty state
  if (!uf) {
    return [];
  }

  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`);
    const data = await response.json();
    
    // Update cache
    citiesCache[uf] = data;
    
    return data;
  } catch (error) {
    console.error(`Error fetching cities for state ${uf}:`, error);
    return [];
  }
};

// React hook to fetch states
export const useStates = () => {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoading(true);
        const data = await fetchStates();
        setStates(data);
        setError(null);
      } catch (err) {
        setError('Failed to load states');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStates();
  }, []);

  return { states, loading, error };
};

// React hook to fetch cities for a state
export const useCities = (uf: string) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if no state is selected
    if (!uf) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        setLoading(true);
        const data = await fetchCitiesByState(uf);
        setCities(data);
        setError(null);
      } catch (err) {
        setError('Failed to load cities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [uf]);

  return { cities, loading, error };
};

// Hard-coded state data to use as a fallback or for offline support
export const brazilianStates = [
  { id: 12, sigla: 'AC', nome: 'Acre' },
  { id: 27, sigla: 'AL', nome: 'Alagoas' },
  { id: 16, sigla: 'AP', nome: 'Amapá' },
  { id: 13, sigla: 'AM', nome: 'Amazonas' },
  { id: 29, sigla: 'BA', nome: 'Bahia' },
  { id: 23, sigla: 'CE', nome: 'Ceará' },
  { id: 53, sigla: 'DF', nome: 'Distrito Federal' },
  { id: 32, sigla: 'ES', nome: 'Espírito Santo' },
  { id: 52, sigla: 'GO', nome: 'Goiás' },
  { id: 21, sigla: 'MA', nome: 'Maranhão' },
  { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
  { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
  { id: 15, sigla: 'PA', nome: 'Pará' },
  { id: 25, sigla: 'PB', nome: 'Paraíba' },
  { id: 41, sigla: 'PR', nome: 'Paraná' },
  { id: 26, sigla: 'PE', nome: 'Pernambuco' },
  { id: 22, sigla: 'PI', nome: 'Piauí' },
  { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
  { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
  { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
  { id: 11, sigla: 'RO', nome: 'Rondônia' },
  { id: 14, sigla: 'RR', nome: 'Roraima' },
  { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
  { id: 35, sigla: 'SP', nome: 'São Paulo' },
  { id: 28, sigla: 'SE', nome: 'Sergipe' },
  { id: 17, sigla: 'TO', nome: 'Tocantins' }
];
