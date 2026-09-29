/**
 * Configuração centralizada de timeouts para testes
 * Ajuste estes valores conforme necessário para seu ambiente
 */
export const TIMEOUTS = {
  // Timeout padrão para operações gerais
  DEFAULT: 60 * 1000, // 60 segundos

  // Timeout para espera de elementos ficarem visíveis
  ELEMENT_VISIBLE: 15 * 1000, // 15 segundos

  // Timeout para navegação entre páginas
  NAVIGATION: 30 * 1000, // 30 segundos

  // Timeout para respostas de rede
  NETWORK: 30 * 1000, // 30 segundos

  // Timeout para operações de clique
  CLICK: 10 * 1000, // 10 segundos

  // Timeout para preenchimento de campos
  FILL: 10 * 1000, // 10 segundos

  // Timeout para espera de estabilidade de animações
  STABLE: 5 * 1000, // 5 segundos
};
