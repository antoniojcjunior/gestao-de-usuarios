// orquestração da tela (lê DOM, valida, chama API)
import { postUsuario } from '../api/usuariosApi.js';
import { validarCamposObrigatorios } from '../utils/util.js';
import { limparFormulario } from '../utils/util.js';

export async function incluirUsuario() {

  // 1) ler campos
  const nome            = (document.getElementById('nome')?.value || '').trim();
  const cpfBruto        = (document.getElementById('cpf')?.value || '').trim();
  const cpf             = cpfBruto.replace(/\D/g, '');
  const setor_id        = document.getElementById('setor')?.value || '';
  const regiao_id       = document.getElementById('regiao')?.value || '';
  const turno_id        = document.getElementById('turno')?.value || '';
  const data_nascimento = document.getElementById('data_nascimento')?.value || '';
  const remuneracao     = document.getElementById('remuneracao')?.value || '';

  // 2) usar SUA função global de validação já existente
  const campos = [
    { valor: nome, mensagem: 'Por favor, informe o nome.' },
    { valor: cpf.length === 11 ? cpf : '', mensagem: 'CPF inválido: informe 11 dígitos.' },
    { valor: data_nascimento, mensagem: 'Por favor, informe a data de nascimento.' },
    { valor: setor_id, mensagem: 'Por favor, selecione o setor.' },
    { valor: regiao_id, mensagem: 'Por favor, selecione a região.' },
    { valor: turno_id, mensagem: 'Por favor, selecione o turno.' },
    { valor: remuneracao, mensagem: 'Por favor, informe a remuneração.' }
  ];
  if (typeof validarCamposObrigatorios === 'function') {
    if (!validarCamposObrigatorios(campos)) return;
  }

  // 3) montar payload
  const dadosEnviados = { nome, cpf, setor_id, regiao_id, turno_id, data_nascimento, remuneracao };
  console.log('📦 Objeto JS montado para enviar ao servidor:', dadosEnviados);
  console.log('JSON enviado no corpo da requisição:', JSON.stringify(dadosEnviados));

  // 4) chamar API e tratar resposta
  try {
    const dados = await postUsuario(dadosEnviados);
    console.log('📬 Retorno do servidor:', dados);
    alert(`Usuário(a) ${nome} cadastrado(a) com sucesso!`);
    limparFormulario();
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    alert(`Erro: ${erro.message || 'Falha ao conectar com o servidor.'}`);
  }
}
