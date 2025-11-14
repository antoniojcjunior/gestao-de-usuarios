/**
 * Adiciona um listener para o evento de fechamento de modais do Bootstrap,
 * garantindo que o elemento focado perca o foco antes do modal ser ocultado
 * para evitar o erro de acessibilidade 'Blocked aria-hidden'.
 */
const setupModalFocusFix = () => {
  // O evento 'hide.bs.modal' é disparado imediatamente quando o método 'hide' 
  // do modal é chamado, permitindo a correção do foco antes que o modal se oculte.
  document.addEventListener('hide.bs.modal', (event) => {
    // Verifica se há um elemento atualmente focado
    if (document.activeElement) {
      // Remove o foco do elemento ativo.
      document.activeElement.blur();
      
      // Opcional: Log para fins de desenvolvimento
      // console.log(`Foco removido do elemento: ${document.activeElement.id || document.activeElement.tagName} - antes de ocultar o modal.`);
    }
  });
};

export { setupModalFocusFix };