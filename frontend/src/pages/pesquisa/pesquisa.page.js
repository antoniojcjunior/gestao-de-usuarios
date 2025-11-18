import { getUsuarios, deleteUsuario } from '../../api/usuarios.api.js';
import { renderTabelaUsuarios } from '../../ui/render-usuarios.component.js';
import { setUsuariosCache } from '../../utils/usuarios-cache.util.js';
import { showAlert, showConfirm } from '../../utils/show-alert.util.js';
import { limparFormulario } from '../../utils/util.util.js';


//ativa o listener botão pesquisar e ao clicar chama o executarPesquisa
export function initPesquisaPage() {
  

const formPesquisa = document.getElementById('formulario');

if (formPesquisa) {
  formPesquisa.addEventListener('submit', function (event) {
    event.preventDefault(); // impede reload da página
    executarPesquisa();     // chama sua função
  });
}

// const btn = document.getElementById('pesquisar');
 
//   if (btn) {
//     btn.addEventListener('click', executarPesquisa);//ouvindo o botão pesquisa
//   }

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-editar');
  if (!btn) return;
  configurarEdicaoDeUsuarios(e);
});
}

//chama o get usuários e depois o renderUsuarios para montar a tela
export async function executarPesquisa() {

  const cpfInput = document.getElementById('cpf');
  let cpf = cpfInput.value;
  cpf = cpf.replace(/\D/g, '');
  const regiaoInput = document.getElementById('regiao');
  let regiao = regiaoInput.value;
  const setorInput = document.getElementById('setor');
  let setor = setorInput.value;
  const nomeInput = document.getElementById('nome');
  let nome = `%${nomeInput.value}%`;
  //console.log(nome);
  const dataNascInicioInput = document.getElementById('data_nascimento_inicio');
  let dataNascInicio = dataNascInicioInput.value;
  console.log(dataNascInicio);
  const dataNascFimInput = document.getElementById('data_nascimento_fim');
  let dataNascFim = dataNascFimInput.value;
  console.log(dataNascFim);

  // <<-- NOVO: Captura dos valores do Tom Select -->>
  // O Select nativo é atualizado automaticamente pelo Tom Select/bibliotecas modernas.
  // Basta pegar o valor do elemento HTML original!
  const turnosSelect = document.getElementById('turnos-multi');
  // Coleta todos os valores selecionados. Retorna um Array de strings.
  const turnosSelecionados = Array.from(turnosSelect.selectedOptions).map(option => option.value);
  try {
    const usuarios = await getUsuarios(cpf, regiao, turnosSelecionados, setor, nome, dataNascInicio, dataNascFim); //resultado da função getUsuarios sendo colocado no array usuarios
    console.log('🔎 Usuários retornados:', usuarios);

    // Atualiza contador (se existir no HTML)
    //const countEl = document.getElementById('usuarios-count');
    //if (countEl) countEl.textContent = `Registros: ${usuarios.length}`;

    // A renderização da tabela virá depois em outro arquivo
    const containerTabela = document.getElementById('resultados-tabela'); 
                        //busca no HTML o <div> dentro de uma tabela que tenha o id="tabela-usuarios"
                        //O resultado é o elemento HTML onde as linhas dos usuários serão inseridas.
                        //Mas até esse ponto, ele ainda está vazio (sem <tr>).
    renderTabelaUsuarios(containerTabela, usuarios); //chama função render e passa 2 param de entrada
    setUsuariosCache(usuarios);//inserindo o resultado o cache para ser utilizado por outros modulos
    return usuarios;

  } catch (err) {
    console.error(err);
    alert('Erro ao buscar usuários.');
    return [];
  }
}

//ativa o listener botão delete e chama função deleteUsuario que por sua vez faz o fetch
export function configurarDelecaoDeUsuarios() {
    // 1. Seleciona o contêiner principal da tabela
    const containerTabela = document.getElementById('resultados-tabela');

    if (!containerTabela) {
        // Se o contêiner não existe (erro de DOM), a função termina.
        console.error('Contêiner da tabela não encontrado. Não foi possível configurar o listener de deleção.');
        return;
    }

    // 2. Anexa o listener de clique ao contêiner
    containerTabela.addEventListener('click', async (e) => {
        // Busca o botão mais próximo que tenha a classe 'btn-deletar' a partir do clique (lixeira ou div ao redor)
        const deleteButton = e.target.closest('.btn-deletar');

        if (deleteButton) {
            e.preventDefault(); 
            
            // Pega o ID do atributo data-id do botão
            const userId = deleteButton.dataset.id;
            const userNome = deleteButton.dataset.nome;

            // Confirmação antes de deletar
            const isConfirmed = await showConfirm(`Confirma a exclusão de ${userNome}?`);  
            if (isConfirmed) {
            //if (confirm(`Confirma a exclusão de ${userNome}?`)) {
                // Chama a API de Deleção
                const sucesso = await deleteUsuario(userId);

                if (sucesso) {
                    //alert(`Usuário ${userNome} excluído com sucesso!`);
                    showAlert(`Usuário(a) ${userNome} excluído com sucesso!`);
                    // Recarrega a lista completa para atualizar o DOM e o contador
                    limparFormulario();
                    executarPesquisa(); 
                    
                } else {
                    alert('Falha ao deletar o usuário. Verifique o console.');
                }
            }
        }
    });
}

export function configurarEdicaoDeUsuarios(e) {
  // Verifica se o alvo do clique é o botão do lápis
  const btn = e.target.closest('.btn-editar');
  if (!btn) return; // Não é clique no lápis → sai da função

  // Captura o ID do registro
  const userId = btn.dataset.id;
  if (!userId) {
    console.error('ID do usuário não encontrado no botão de edição.');
    return;
  }

  // Faz o redirecionamento para a página de formulário
  // passando o ID na querystring
  //window.location.href = `/pages/usuarioform.html?id=${userId}`;
  window.location.href = "src/pages/usuarios/usuarioform.html?id=" + userId;

}
