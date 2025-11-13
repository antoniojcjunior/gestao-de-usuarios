// Pega os elementos do DOM
const modalElement = document.getElementById('validationModal');
const modalMessage = document.getElementById('modalMessage');

export function showAlert(message) { // <-- EXPORT AQUI
    // 1. Injeta a mensagem no corpo do Modal
    modalMessage.innerHTML = message;

    // 2. Cria e exibe a instância do Modal do Bootstrap
    // Certifique-se de que a variável 'bootstrap' está acessível globalmente (ela vem do bootstrap.bundle.js)
    const validationModal = new bootstrap.Modal(modalElement);
    validationModal.show();
}
