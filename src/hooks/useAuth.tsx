
import { useState } from 'react';

// Hook compartilhado para autenticação do usuário
export const useAuth = () => {
  // Mockup simples para demonstração - substituir pela sua lógica real de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{name: string; email: string; photoUrl?: string} | null>(null);
  
  const login = () => {
    // Função de mockup para login - substituir pela sua implementação real
    setIsAuthenticated(true);
    setUser({ name: 'Usuário Teste', email: 'usuario@teste.com' });
  };
  
  const logout = () => {
    // Função de mockup para logout - substituir pela sua implementação real
    setIsAuthenticated(false);
    setUser(null);
  };
  
  return { isAuthenticated, user, login, logout };
};
