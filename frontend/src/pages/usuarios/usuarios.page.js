// orquestração da tela (lê DOM, valida, chama API)
import { postUsuario, atualizarUsuario } from '../../api/usuarios.api.js';
import { validarCamposObrigatorios } from '../../utils/util.util.js';
import { limparFormulario } from '../../utils/util.util.js';
import { showConfirm, showAlert } from '../../utils/show-alert.util.js';


export async function processarFormularioUsuario(userId) {

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

  // Define a Ação e a Mensagem de Confirmação
  console.log('ID do usuario', userId);
  const acao = userId ? 'Atualização' : 'Inclusão';
  const isConfirmed = await showConfirm(`Confirma ${acao}?`);

  if (!isConfirmed) {
      // Se o usuário clicou em 'Não' (isConfirmed é false),
      // SIMPLESMENTE TERMINAMOS A FUNÇÃO AQUI:
      // A TELA DE EDIÇÃO JÁ É MANTIDA, POIS NÃO HOUVE REDIRECIONAMENTO OU LIMPEZA.
      return; // <--- Isso cancela o processo de inclusão
  }
  // 3) montar payload
  const dadosEnviados = { nome, cpf, setor_id, regiao_id, turno_id, data_nascimento, remuneracao };
  console.log(`Objeto JS montado para ${acao}:`, dadosEnviados);
  console.log('JSON enviado no corpo da requisição:', JSON.stringify(dadosEnviados));

  // 4) chamar API e tratar resposta
  try {
    let dados;
    let mensagemSucesso;
    
    if (userId) {
      dados = await atualizarUsuario(userId, dadosEnviados);
      console.log('TESTE 02 retorno back: ', dados);//era só pra testar, mostrou a log certinha
      
      // 🔹 NOVO: diferencia "sem alteração" x "update de fato"
      if (dados && dados.mensagem) {
        // Caso 1: BACK DISSE QUE NADA MUDOU
        // Ex.: { mensagem: 'Nenhuma alteração detectada...', camposAlterados: [] }
        await showAlert(dados.mensagem); // mantém na tela de edição, sem redirect
      } else {
        // Caso 2: UPDATE REALIZADO (veio objeto de usuário ou true)
        mensagemSucesso = `Usuário(a) ${nome} atualizado(a) com sucesso!`;
        await showAlert(mensagemSucesso);
        window.location.href = "../../../index.html"; // redireciona p/ pesquisa
      }
    }
    else {
      // MODO INCLUSÃO: Chama a API de Criação (POST)
      // A função postUsuario deve ter sido importada/definida
      try {
        dados = await postUsuario(dadosEnviados);
        mensagemSucesso = `Usuário(a) ${nome} cadastrado(a) com sucesso!`;
        await showAlert(mensagemSucesso);
        limparFormulario(); // Limpa o formulário após inclusão
      }
      catch (error) {
        // ERRO: O formulário NÃO é limpo. A lógica de erro é tratada aqui.
        console.log('Falha no cadastro:', error);
        throw error;
      }
    }
    console.log(`📬 Retorno do servidor (${acao}):`, dados);
    
    //await showConfirm(mensagemSucesso);
    //redireciona para a pagina de pesquisa
    //window.location.href = "../../../index.html";
    //showAlert("Inclusão realizada com sucesso!");
    //alert(`Usuário(a) ${nome} cadastrado(a) com sucesso!`);
    //limparFormulario();
  } catch (erro) {
    console.log(`Erro na requisição de ${acao}:`, erro);
    //alert(`Erro: ${erro.message || 'Falha ao conectar com o servidor.'}`);
  }
}
