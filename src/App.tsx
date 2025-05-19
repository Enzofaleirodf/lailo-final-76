
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
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

// Create a client outside of the component function to avoid recreating it on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Páginas Principais */}
              <Route path="/" element={<Home />} />
              
              {/* Redirecionamento de Buscador */}
              <Route path="/buscador" element={<Navigate to="/buscador/imoveis" replace />} />
              <Route path="/buscador/imoveis" element={<BuscadorImoveis />} />
              <Route path="/buscador/veiculos" element={<BuscadorVeiculos />} />
              
              {/* Redirecionamento de Favoritos */}
              <Route path="/favoritos" element={<Navigate to="/favoritos/imoveis" replace />} />
              <Route path="/favoritos/imoveis" element={<FavoritosImoveis />} />
              <Route path="/favoritos/veiculos" element={<FavoritosVeiculos />} />
              
              {/* Leiloeiros e Perfil */}
              <Route path="/leiloeiros" element={<Leiloeiros />} />
              <Route path="/perfil" element={<Perfil />} />
              
              {/* Páginas de Autenticação */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/sign-up" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Rota para página não encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
