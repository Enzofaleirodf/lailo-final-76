
import { useMediaQuery } from './useMediaQuery';

/**
 * Hook para detectar se o dispositivo atual é mobile ou tablet.
 * Utiliza o hook useMediaQuery para verificar o tamanho da tela.
 * Considera tablets como dispositivos móveis para melhor experiência.
 * 
 * @returns boolean indicando se o viewport atual é considerado mobile
 */
export function useIsMobile() {
  return useMediaQuery('mdMax');
}
