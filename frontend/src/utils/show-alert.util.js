// Pega os elementos do DOM
const modalElement = document.getElementById('validationModal');
const modalMessage = document.getElementById('modalMessage');

// Elementos de Controle de Botões
const confirmYesButton = document.getElementById('confirmYesButton');
const confirmNoButton = document.getElementById('confirmNoButton');
const alertOkButton = document.getElementById('alertOkButton');

export function showAlert(message) {

    // Garante que APENAS o botão OK apareça no modo Alerta.
    confirmYesButton.style.display = 'none';    // Esconde o botão "Sim"
    confirmNoButton.style.display = 'none';     // Esconde o botão "Não"
    alertOkButton.style.display = 'inline-block'; // Garante que o botão "OK" apareça
    // Injeta a mensagem no corpo do Modal
    modalMessage.innerHTML = message;

    // Cria e exibe a instância do Modal do Bootstrap
    // Certifique-se de que a variável 'bootstrap' está acessível globalmente (ela vem do bootstrap.bundle.js)
    const validationModal = new bootstrap.Modal(modalElement);
    validationModal.show();
}

// Função de Confirmação
export function showConfirm(message) {
    // Esconde o botão 'OK' do showAlert e mostra os botões de confirmação
    alertOkButton.style.display = 'none';
    confirmYesButton.style.display = 'inline-block';
    confirmNoButton.style.display = 'inline-block';

    // Seta a mensagem
    modalMessage.innerHTML = message;
    
    const confirmationModal = new window.bootstrap.Modal(modalElement);
    
    return new Promise(resolve => {
        // Exibe o modal
        confirmationModal.show();

        // Listener para o botão 'Sim'
        confirmYesButton.onclick = () => {
            confirmationModal.hide(); // Esconde o modal
            resolve(true); // Resolve a Promise com TRUE (Confirmado)
        };

        // Listener para o botão 'Não' e clique fora do modal
        const handleCancel = () => {
            confirmationModal.hide(); // Esconde o modal
            resolve(false); // Resolve a Promise com FALSE (Cancelado)
        };

        confirmNoButton.onclick = handleCancel;
        // Garante que o clique fora do modal também conte como Cancelar
        modalElement.addEventListener('hidden.bs.modal', function onHidden() {
            // Só resolve se o modal foi fechado e a Promise ainda não foi resolvida (pelo 'Sim')
            if (resolve) {
                resolve(false); 
            }
            // Remove o listener para evitar múltiplas chamadas
            modalElement.removeEventListener('hidden.bs.modal', onHidden);
        });
    });
}