import { showAlert } from './showAlert.js';

// Função para limpar formulário
export function limparFormulario() {
  const form = document.getElementById('formulario');
  form.reset();

  form.querySelectorAll('select').forEach((sel) => {
  let placeholder = sel.querySelector('option[value=""]');
                                    /*verificar se o <select> já tem essa <option> vazia dentro dele.
                                    Ele procura se o elemento existe antes de criar outro.*/
  if (!placeholder) { //trata se o <select> não tiver a <option value="">
    placeholder = document.createElement('option');
    placeholder.value = '';
    sel.insertBefore(placeholder, sel.firstChild);
  }
  
  console.log(placeholder);
  placeholder.textContent = sel.dataset.placeholder || '-- Escolha uma opção --';
                                    /*se sel.dataset.placeholder existir e tiver conteúdo, ele será usado.
                                    Se não existir, insere na option o texto padrão '-- Escolha uma opção --'.*/
  sel.value = ''; /*Define o valor atual do <select> como vazio, fazendo o placeholder aparecer selecionado.*/
});
}
//Aplica mascara nos input de CPF
export function aplicarMascaraCPF() {
  const input = document.getElementById('cpf');
  if (!input) return;

  // Máscara durante a digitação
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');

    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 9) {
      v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    }

    e.target.value = v;
  });

  // Remove formatação ao sair do campo (onblur)
  /*input.addEventListener('blur', (e) => {
    const somenteNumeros = e.target.value.replace(/\D/g, '');
    e.target.value = somenteNumeros;
  });*/
}
//Aplica mascara nos input de valores
export function aplicarMascaraMonetaria(elementId = 'remuneracao', options = {}) {
  
  // 1. Verificar se a biblioteca VMasker está carregada
  if (typeof VMasker === 'undefined') {
      console.error("VMasker não está definido. Verifique a ordem de carregamento dos scripts no HTML.");
      return;
  }

  // 2. Encontrar o elemento HTML usando o ID
  const inputElement = document.getElementById(elementId);

  if (!inputElement) {
      console.warn(`Elemento com ID '${elementId}' não encontrado. A máscara não foi aplicada.`);
      return;
  }

  // 3. Definir as opções padrão para o formato BRL (Brasileiro)
  const defaultOptions = {
      precision: 2,   // 2 casas decimais
      separator: ',', // Separador decimal (vírgula)
      delimiter: '.', // Separador de milhares (ponto)
      unit: 'R$ ',    // Prefixo
      zeroes: 0, 
      reverse: true   // Aplica a máscara da direita para a esquerda (padrão de moedas)
  };

  // 4. Juntar as opções padrão com as opções passadas, se houver customização
  const finalOptions = { ...defaultOptions, ...options };

  // 5. Aplicar a máscara no elemento
  VMasker(inputElement).maskMoney(finalOptions);
  
  console.log(`Máscara monetária aplicada ao elemento com ID: ${elementId}`);
}
//Limita a data nascimento menor do que hoje
export function limitaDataNascimento() {
  // gera data de hoje no formato AAAA-MM-DD
  const hoje = new Date().toISOString().split('T')[0];
  // aplica como valor máximo do input
  document.getElementById('data_nascimento').setAttribute('max', hoje);

  const data_nascimento = document.getElementById('data_nascimento').value;
  if (data_nascimento && data_nascimento > new Date().toISOString().split('T')[0]) {
    alert('A data de nascimento não pode ser no futuro.');
    return;
  }
}
//Valida se todos os campos foram preenchidos e apresenta msg caso nao tenham sido
export function validarCamposObrigatorios(campos) {
for (const campo of campos) {
  if (!campo.valor) {
    showAlert(campo.mensagem);
    return false;
  }
}
return true;
} 
//CPF retornado no get e inserido na tela de resultado
export function formatCpf(cpf) {
  const d = String(cpf || '').replace(/\D/g, '');
  if (d.length !== 11) return (cpf ?? '').toString();
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
//ajuste de tag tbody na apresentação do resultado
export function escapeHtml(str) { 
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
//Formata um valor R$ proveniente do BD
export function formatarMoedaBR(valor) {
  if (valor == null || valor === '') return ''; // evita mostrar "R$ NaN"
  const numero = Number(valor);
  if (isNaN(numero)) return valor; // se não for número, retorna como está
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
//Formata uma string de data from BD (ex: YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY).
export const formatDateToBR = (dateString) => {
    // Retorna string vazia se o valor for nulo, indefinido ou vazio
    if (!dateString) {
        return '';
    }

    // 1. Cria um objeto Date. Adicionar 'T00:00:00' ajuda a garantir que a data seja 
    // interpretada como local para evitar problemas de TimeZone em datas puras (YYYY-MM-DD).
    const date = new Date(dateString.includes('T') ? dateString : `${dateString}T00:00:00`);

    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
        // Se for uma string inválida, retorna a string original ou vazia, dependendo da necessidade
        return dateString; 
    }

    // 2. Utiliza toLocaleDateString com o locale 'pt-BR' para formatar
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
};