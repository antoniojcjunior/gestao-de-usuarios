import { processarFormularioUsuario } from '../pages/usuarios/usuarios.page.js';
import { preencherUFs } from '../utils/localizacao.util.js';
import { aplicarMascaraCPF } from '../utils/util.util.js';
import { carregarSelect, selectFilter } from '../utils/carregar-select.util.js';
import { ajustarCampoDataParaMobile } from '../utils/data-mobile.util.js';
import { aplicarMascaraMonetaria, limitaDataNascimento, limparFormulario } from '../utils/util.util.js';
import { getUsuarioPorId } from '../api/usuarios.api.js';


const API_BASE = window.location.origin.includes('vercel.app')
  ? '' // produção: chama via rewrite VERCEL.JSON (/api/...)
  : 'http://localhost:3000'; // desenvolvimento local

// A função 'let' é usada porque o valor será atribuído/modificado dentro do DOMContentLoaded.
let userId = null;

document.addEventListener('DOMContentLoaded', async () => {
  aplicarMascaraCPF();
  aplicarMascaraMonetaria();
  preencherUFs();
  const inputId = document.getElementById('data_nascimento').id;
  limitaDataNascimento(inputId);
  const MobileDataInput = document.getElementById('data_nascimento');
  ajustarCampoDataParaMobile(MobileDataInput);

  await Promise.all([
        // Carrega Setores, Regiões e Turnos em paralelo para máxima performance.
        carregarSelect({ url: `${API_BASE}/api/setores`, selectId: 'setor', montarLabel: (item) => `${item.sigla} — ${item.nome}` }),
        carregarSelect({ url: `${API_BASE}/api/regioes`, selectId: 'regiao' }),
        carregarSelect({ url: `${API_BASE}/api/turnos`, selectId: 'turno', labelCampo: 'turno' })
    ]);
    
  // Inicializa o Tom Select (Somente após o 'await' garantir que 'setor' está populado)
  selectFilter('setor');

  const btnLimpar = document.getElementById('limpar');
  btnLimpar.addEventListener('click', (e) => {
    e.preventDefault();
    limparFormulario(); // chama a função acima
  });
  const btnPesquisa = document.getElementById('voltar');
  btnPesquisa.addEventListener('click', (e) => {
    window.location.href = "../../../index.html";
  });

// Detecta se existe um ID na URL
const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

// Se existir ID → estamos em modo edição
if (userId) {

  // Ajusta o titulo da pagina
  const tituloPage = document.getElementById('titulo-page');
  if (tituloPage) {
    tituloPage.textContent = 'Alteração de Usuário';
  }

  // Ajusta o background
  document.getElementById('secPrincipal').classList.add('bg-alteracao');
  document.getElementById('bodyMain').classList.add('body-bg-alteracao');
  //document.getElementById('header-form').classList.add('body-bg-alteracao');
  //document.getElementById('header-title').classList.add('boldTitle');
  
  // Ajusta o label do card flutuante
  const tituloEl = document.getElementById('titulo-form');
  if (tituloEl) {
    tituloEl.textContent = 'Alterar Usuário';
    document.getElementById('titulo-form').classList.add('boldTitle');
  }
    // Ajusta o texto do botão principal
  const botaoEl = document.getElementById('enviar');
  if (botaoEl) {
    botaoEl.textContent = 'Salvar Alterações';
  }
  
  //oculta botao limpar
  const btnLimpar = document.getElementById('limpar');
  if (btnLimpar) {
    btnLimpar.style.display = 'none';
  }

  // Buscar os dados do usuário
  try {
    const usuario = await getUsuarioPorId(userId);

    // 5) Preencher os campos do formulário
    document.getElementById('nome').value = usuario.nome || '';
    document.getElementById('cpf').value  = usuario.cpf  || '';
    //document.getElementById('setor').value  = usuario.setor_id  || '';
    document.getElementById('regiao').value = usuario.regiao_id || '';
    document.getElementById('turno').value  = usuario.turno_id  || '';
    // --- ATUALIZAÇÃO PARA TOM SELECT (SETOR) ---
    const selectSetor = document.getElementById('setor');
    if (selectSetor && selectSetor.tomselect) {
      selectSetor.tomselect.setValue(usuario.setor_id || '');
    } else {
      // Se não for Tom Select ou ainda não foi inicializado
      selectSetor.value = usuario.setor_id || '';
    }

    // Formato de data (YYYY-MM-DD)
    if (usuario.data_nascimento) {
      const data = String(usuario.data_nascimento).slice(0, 10);
      document.getElementById('data_nascimento').value = data;
    }

    document.getElementById('remuneracao').value = usuario.remuneracao || '';

  } catch (erro) {
    console.error('Falha ao carregar dados do usuário:', erro);
    alert('Erro ao carregar dados do usuário.');
  }
}
  // Listener de SUBMIT (com acesso ao userId)
  
  document.getElementById('formulario').addEventListener('submit', async (e) => {
      e.preventDefault(); 
      // O valor de userId (null ou o ID) é passado para a função de processamento.
      await processarFormularioUsuario(userId); 
  });

});


