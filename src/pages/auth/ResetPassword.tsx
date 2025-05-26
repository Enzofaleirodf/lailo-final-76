import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { handleError } from '@/utils/errorUtils';
import { logUserAction } from '@/utils/loggingUtils';
import { Helmet } from 'react-helmet-async';
import ErrorBoundary from '@/components/ErrorBoundary';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Por favor, insira seu email.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      logUserAction('reset_password_attempt', { email });

      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
        logUserAction('reset_password_error', { error: resetError.message });
        return;
      }

      logUserAction('reset_password_success', { email });
      setSuccess(true);
    } catch (err) {
      handleError(err, 'ResetPassword.handleSubmit');
      setError('Ocorreu um erro ao solicitar a redefinição de senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary componentName="ResetPassword">
      <Helmet>
        <title>Redefinir Senha | Lailo</title>
        <meta name="description" content="Redefina sua senha para acessar sua conta na Lailo" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
            <CardDescription>
              Insira seu email para receber um link de redefinição de senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
                <h3 className="font-medium mb-2">Email enviado!</h3>
                <p>Verifique sua caixa de entrada para redefinir sua senha.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Redefinir Senha'}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="ghost" className="w-full" onClick={() => navigate('/auth/login')}>
              Voltar para o login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default ResetPassword;