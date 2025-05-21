
import { useMediaQuery } from './useMediaQuery';

/**
 * Hook para detectar se o dispositivo atual é mobile.
 * Utiliza o hook useMediaQuery para verificar o tamanho da tela
 * 
 * @returns boolean indicando se o viewport atual é considerado mobile
 */
export function useIsMobile() {
  return !useMediaQuery('md');
}
