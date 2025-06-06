
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started');
        setLoading(true);
        
        // Get the auth code from the URL
        const code = searchParams.get('code');
        const type = searchParams.get('type');
        
        if (!code) {
          setError('Código de autenticação não encontrado');
          console.error('Auth callback error: No code found');
          return;
        }
        
        // Mock successful authentication
        console.log('Auth callback success:', { type });
        
        // Redirect to home page
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('Ocorreu um erro durante a autenticação');
      } finally {
        setLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate, searchParams]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="text-center">
        {loading ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Autenticando...</h2>
            <p className="text-gray-500">Por favor, aguarde enquanto finalizamos o processo de autenticação.</p>
            <div className="mt-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
            </div>
          </>
        ) : error ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-600">Erro na autenticação</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => navigate('/auth/login')} className="mt-2">
              Voltar para o login
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">Autenticação bem-sucedida!</h2>
            <p className="text-gray-700">Redirecionando para a página inicial...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
