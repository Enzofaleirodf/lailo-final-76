
# Design System - Documentação

## Introdução

Este documento descreve o design system utilizado no projeto, estabelecendo padrões para garantir consistência visual e comportamental entre os diferentes breakpoints e dispositivos.

## Tokens de Design

### Breakpoints

Os breakpoints definidos no sistema seguem a seguinte estrutura:

```typescript
export const breakpoints = {
  xs: '(max-width: 375px)',
  sm: '(max-width: 640px)',
  md: '(max-width: 768px)',
  lg: '(max-width: 1024px)',
  xl: '(max-width: 1280px)',
  '2xl': '(max-width: 1536px)',
};
```

### Cores

- **Brand:**
  - Primary: `brand-600`, `brand-700` (botões, elementos principais)
  - Secondary: `brand-50`, `brand-100`, `brand-200` (backgrounds, borders)
  - Text: `brand-800` (texto em elementos brand)

- **Neutros:**
  - Text: `gray-600`, `gray-700`, `gray-800` (texto comum)
  - Borders: `gray-200`, `gray-300` (bordas e separadores)
  - Backgrounds: `white`, `gray-50`, `gray-100` (fundos)

- **Estados:**
  - Hover: Estado aumenta em 100 (ex: `brand-600` -> `brand-700`)
  - Focus: `ring-2 ring-brand-500 ring-offset-1`
  - Active/Selected: Usa cores brand mais fortes

### Tipografia

- **Tamanhos:**
  - xs: 0.75rem (12px)
  - sm: 0.875rem (14px)
  - base: 1rem (16px)
  - lg: 1.125rem (18px)
  - xl: 1.25rem (20px)

- **Pesos:**
  - normal: 400
  - medium: 500
  - semibold: 600
  - bold: 700

### Espaçamentos

- **Paddings e Margins:**
  - 0: 0px
  - 1: 0.25rem (4px)
  - 2: 0.5rem (8px)
  - 3: 0.75rem (12px)
  - 4: 1rem (16px)
  - 6: 1.5rem (24px)
  - 8: 2rem (32px)

- **Gaps:**
  - Utilizar os mesmos tokens de espaçamento

### Bordas e Radius

- **Radius:**
  - sm: 0.125rem (2px)
  - DEFAULT: 0.25rem (4px)
  - md: 0.375rem (6px)
  - lg: 0.5rem (8px)
  - xl: 0.75rem (12px)
  - full: 9999px (círculo)

- **Border width:**
  - DEFAULT: 1px
  - 0: 0px
  - 2: 2px
  - 4: 4px
  - 8: 8px

## Componentes

### Botões

- **Variantes:**
  - default: Fundo `brand-600`, texto branco
  - outline: Borda `gray-300`, fundo branco, texto `gray-700`
  - secondary: Fundo `gray-100`, texto `gray-800`

- **Tamanhos:**
  - sm: h-8, px-3, text-sm
  - DEFAULT: h-10, px-4, text-sm
  - lg: h-12, px-6, text-base

### Inputs

- **Estilo base:**
  - Borda `gray-300`
  - Altura: h-10 (40px)
  - Arredondamento: rounded-lg
  - Padding: px-3
  - States:
    - Focus: ring-2 ring-brand-500
    - Error: border-red-300, ring-red-500

### Dropdowns

Usar o componente `FilterDropdown` para manter consistência.

### Filtros

Os componentes de filtro devem manter consistência visual e comportamental entre desktop e mobile.

- **Estados do Filtro:**
  - Normal: Texto `gray-700`
  - Selecionado: Texto `brand-700`, font-medium
  - Hover: Fundo `gray-50`

## Responsividade

### Mobile (< 768px)

- Filtros exibidos em um drawer/modal
- Navegação simplificada
- Elementos em layout de coluna única

### Desktop (>= 768px)

- Filtros exibidos em barra lateral
- Navegação completa
- Layout em múltiplas colunas

## Acessibilidade

- Todos os elementos interativos devem ter:
  - Foco visível (`focus-visible:ring-2`)
  - aria-labels apropriados
  - Suporte a navegação por teclado

- Contraste de cores deve seguir WCAG AA no mínimo
- Textos devem ter tamanho mínimo de 14px para leitura

## Regras de Consistência

- Elementos interativos similares devem ter feedback visual consistente
- Espaçamentos devem seguir um ritmo vertical e horizontal consistente
- Cores devem ser aplicadas de forma coerente para funções similares
- Tipografia deve seguir hierarquia clara e consistente
