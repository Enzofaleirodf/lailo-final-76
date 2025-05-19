
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Aqui será implementado o callback de autenticação do Supabase
    console.log('Processando callback de autenticação');
    
    // Por enquanto, apenas redirecionamos para a página inicial após 2 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Autenticando...</h2>
        <p className="text-gray-500">Por favor, aguarde enquanto finalizamos o processo de autenticação.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
