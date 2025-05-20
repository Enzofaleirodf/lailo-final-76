
import * as React from "react";
import { useMediaQuery } from "./useMediaQuery";

/**
 * Hook para verificar se o dispositivo atual é considerado mobile.
 * Utiliza o sistema unificado de media queries para garantir consistência
 * entre todos os componentes.
 * 
 * @returns {boolean} true se o dispositivo é mobile (< 768px), false caso contrário
 */
export function useIsMobile() {
  // Usar o sistema unificado de media queries
  // Isso garante consistência com o resto da aplicação
  return useMediaQuery("md");
}
