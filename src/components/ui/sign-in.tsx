
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogClose } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface LightLoginProps {
  isInDialog?: boolean;
  hideCloseButton?: boolean;
}

export const LightLogin: React.FC<LightLoginProps> = ({ isInDialog = false, hideCloseButton = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // Close dialog if in dialog mode
      if (isInDialog) {
        // The dialog will be closed by the parent component
      } else {
        // Navigate to home page
        navigate('/');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock Google sign in
      console.log('Google sign in attempt');
      setError('Google sign in not implemented yet');
    } catch (err) {
      console.error('Error during Google sign in:', err);
      setError('Ocorreu um erro ao fazer login com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50\n">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
        {!hideCloseButton && (
          isInDialog ? (
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-[191]">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          ) : (
            <button 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-[191]"
              onClick={() => window.history.back()}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )
        )}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-100 via-blue-50 to-transparent opacity-40 blur-3xl -mt-20"></div>
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
              <svg width="48" height="48" viewBox="0 0 110 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100.83 28.63L66.86 3.95c-7.25-5.26-17.07-5.26-24.35 0L8.54 28.63C1.29 33.89-1.76 43.23 1.01 51.77l12.98 39.93c2.77 8.53 10.72 14.3 19.7 14.3h41.97c8.98 0 16.93-5.76 19.7-14.3l12.98-39.93c2.77-8.53-.28-17.88-7.53-23.14ZM64.81 63.13l-10.13 18.55-10.13-18.55-18.55-10.13 18.55-10.13 10.13-18.55 10.13 18.55 18.55 10.13-18.55 10.13Z" fill="#202A44" />
              </svg>
            </div>
            <div className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Bem-vindo à Lailo</h2>
              <p className="text-center text-gray-500 mt-2">Entre ou cadastre-se</p>
            </div>
          </div>

          <div className="space-y-6 p-0">
            <form onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 h-12 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/50 focus:border-blue-500 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Digite seu email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Senha</label>
                  <a href="/auth/reset-password" className="text-xs text-blue-600 hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="bg-gray-50 border-gray-200 text-gray-900 pr-12 h-12 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/50 focus:border-blue-500 w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Mostrar"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200 mt-2">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-t from-brand-600 via-brand-500 to-brand-400 hover:from-brand-700 hover:via-brand-600 hover:to-brand-500 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-brand-100 active:scale-[0.98] inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-6"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-400">ou continue com</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button 
                className="h-12 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg flex items-center justify-center gap-2 border bg-background inline-flex whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="whitespace-nowrap">Google</span>
              </button>
            </div>
          </div>

          <div className="p-0 mt-6">
            <p className="text-sm text-center text-gray-500 w-full">
              Não tem uma conta?{" "}
              <a href="/auth/sign-up" className="text-blue-600 hover:underline font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>;
};
