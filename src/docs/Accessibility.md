
# Diretrizes de Acessibilidade

Este documento estabelece as diretrizes de acessibilidade que todos os componentes do sistema devem seguir para garantir conformidade com WCAG 2.1 nível AA.

## Princípios Gerais

### Perceptível

1. **Alternativas em Texto:**
   - Todas as imagens devem ter atributos `alt` descritivos
   - Ícones que transmitem informação devem ter texto alternativo

2. **Conteúdo Adaptável:**
   - O layout deve ser responsivo e funcionar em orientações retrato e paisagem
   - O conteúdo deve ser legível sem CSS ou com CSS personalizado

3. **Distinguível:**
   - Contraste de cores deve seguir WCAG AA (4.5:1 para texto normal, 3:1 para texto grande)
   - Não utilizar apenas cor para transmitir informação
   - Texto deve ser redimensionável até 200% sem perda de conteúdo ou funcionalidade

### Operável

1. **Acessível por Teclado:**
   - Todas as funcionalidades devem ser operáveis via teclado
   - Não deve haver armadilhas de foco
   - Ordem de foco lógica

2. **Tempo Suficiente:**
   - Alertas e mensagens devem permanecer visíveis por tempo adequado
   - Animações podem ser pausadas ou desativadas

3. **Navegação:**
   - Títulos e rótulos descritivos
   - Foco visível em todos os elementos interativos

### Compreensível

1. **Legível:**
   - Identificar o idioma da página
   - Explicar abreviações e termos técnicos

2. **Previsível:**
   - Comportamento consistente de navegação e interação
   - Mudanças de contexto apenas quando esperadas

3. **Assistência de Entrada:**
   - Identificação clara de erros
   - Rótulos e instruções para entrada de dados
   - Prevenção de erros em entradas importantes

### Robusto

1. **Compatível:**
   - HTML válido e bem formado
   - ARIA usado corretamente quando necessário
   - Funcionalidade acessível em diferentes navegadores e tecnologias assistivas

## Implementação Prática

### Formulários e Entradas

- Todos os inputs devem ter labels associados (explícitos ou aria-label)
- Grupos de inputs devem ter legendas descritivas
- Feedback de erro deve ser explícito e ligado ao campo com `aria-describedby`
- Estados de validação devem ser comunicados com `aria-invalid`

### Navegação

- Menus devem ser navegáveis por teclado com teclas de seta
- Skip links para usuários de teclado pularem para o conteúdo principal
- Breadcrumbs para orientação

### Componentes Interativos

#### Botões
- Usar elementos `<button>` nativos quando possível
- Fornecer texto descritivo (não apenas ícones)
- Estados distintos para hover, focus, active e disabled

#### Modais e Popovers
- Trap focus dentro do modal quando aberto
- Fechamento com ESC
- `aria-modal="true"` e role="dialog"
- Retorno de foco ao elemento que abriu o modal

#### Accordion e Tabs
- Usar atributos ARIA apropriados (aria-expanded, aria-controls)
- Navegação por setas e atalhos de teclado

### Imagens e Mídia

- Atributos alt descritivos para todas as imagens
- Não usar imagens de texto
- Controles para vídeo e áudio
- Legendas para conteúdo de áudio

## Checklist de Acessibilidade

- [ ] Testar navegação por teclado
- [ ] Verificar ordem de foco
- [ ] Confirmar rótulos de formulários e instruções
- [ ] Verificar contrastes de cor
- [ ] Testar com zoom até 200%
- [ ] Validar HTML e atributos ARIA
- [ ] Testar com leitores de tela (NVDA, VoiceOver)
- [ ] Verificar mensagens de erro e status
- [ ] Confirmar que não há dependência apenas de cor para informação
- [ ] Checar redimensionamento em diferentes dispositivos

## Ferramentas Recomendadas

- Lighthouse (Google Chrome)
- axe DevTools (Chrome Extension)
- WAVE Web Accessibility Evaluation Tool
- Contrast Checker (WebAIM)
- Screen readers: NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
