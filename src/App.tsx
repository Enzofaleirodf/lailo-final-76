
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./hooks/useAuth";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import BuscadorImoveis from "./pages/buscador/BuscadorImoveis";
import BuscadorVeiculos from "./pages/buscador/BuscadorVeiculos";
import FavoritosImoveis from "./pages/favoritos/FavoritosImoveis";
import FavoritosVeiculos from "./pages/favoritos/FavoritosVeiculos";
import Leiloeiros from "./pages/Leiloeiros";
import Perfil from "./pages/Perfil";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a client outside of the component function to avoid recreating it on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Layout wrapper for the main application
const MainLayout = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary componentName="App">
        <AuthProvider>
          <HelmetProvider>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Auth Routes - No Layout */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/sign-up" element={<SignUp />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    {/* Main Application Routes - With AppLayout */}
                    <Route element={<MainLayout />}>
                      {/* Páginas Principais */}
                      <Route path="/" element={<Home />} />
                      
                      {/* Buscador Routes */}
                      <Route path="/buscador" element={<Navigate to="/buscador/imoveis" replace />} />
                      <Route path="/buscador/imoveis" element={<BuscadorImoveis />} />
                      <Route path="/buscador/veiculos" element={<BuscadorVeiculos />} />
                      
                      {/* Favoritos Routes - Protected */}
                      <Route path="/favoritos" element={<Navigate to="/favoritos/imoveis" replace />} />
                      <Route path="/favoritos/imoveis" element={
                        <ProtectedRoute>
                          <FavoritosImoveis />
                        </ProtectedRoute>
                      } />
                      <Route path="/favoritos/veiculos" element={
                        <ProtectedRoute>
                          <FavoritosVeiculos />
                        </ProtectedRoute>
                      } />
                      
                      {/* Leiloeiros e Perfil */}
                      <Route path="/leiloeiros" element={<Leiloeiros />} />
                      <Route path="/perfil" element={<Perfil />} />
                      
                      {/* Not Found */}
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </QueryClientProvider>
          </HelmetProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
