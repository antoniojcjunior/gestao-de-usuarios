import { incluirUsuario } from './pages/usuariosPage.js';
import { preencherUFs } from './utils/localizacao.js';
import { aplicarMascaraCPF } from './utils/util.js';
import { carregarSelect, selectFilter } from './utils/carregarSelect.js';
import { ajustarCampoDataParaMobile } from './utils/dataMobile.js';
import { aplicarMascaraMonetaria, limitaDataNascimento, limparFormulario } from './utils/util.js';
import { getUsuarioPorId } from './api/usuariosApi.js';

const API_BASE = window.location.origin.includes('vercel.app')
  ? '' // produção: chama via rewrite VERCEL.JSON (/api/...)
  : 'http://localhost:3000'; // desenvolvimento local

//document.getElementById('enviar').addEventListener('click', incluirUsuario);
document.getElementById('formulario').addEventListener('submit', async (e) => {
  e.preventDefault(); // impede o recarregamento da página
  await incluirUsuario(); // chama a função que faz o POST
});

/*document.addEventListener('DOMContentLoaded', carregarSetores); /*chama a função carregarSetores depois que o HTML temrina de carregar*/
document.addEventListener('DOMContentLoaded', async () => {
  aplicarMascaraCPF();
  aplicarMascaraMonetaria();
  preencherUFs();
  limitaDataNascimento();
  ajustarCampoDataParaMobile()
  await Promise.all([
        // Carrega Setores, Regiões e Turnos em paralelo para máxima performance.
        carregarSelect({ url: `${API_BASE}/api/setores`, selectId: 'setor', montarLabel: (item) => `${item.sigla} — ${item.nome}` }),
        carregarSelect({ url: `${API_BASE}/api/regioes`, selectId: 'regiao' }),
        carregarSelect({ url: `${API_BASE}/api/turnos`, selectId: 'turno', labelCampo: 'turno' })
    ]);
    
    // 2. Inicializa o Tom Select (Somente após o 'await' garantir que 'setor' está populado)
    selectFilter('setor');
});

// Listener dos botões
document.addEventListener('DOMContentLoaded', async () => {
  const btnLimpar = document.getElementById('limpar');
  btnLimpar.addEventListener('click', (e) => {
    e.preventDefault();
    limparFormulario(); // chama a função acima
  });
  const btnPesquisa = document.getElementById('voltar');
  btnPesquisa.addEventListener('click', (e) => {
    window.location.href = "../index.html";
  });

  // Detecta se existe um ID na URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

// Se existir ID → estamos em modo edição
if (id) {

  // Ajusta o titulo da pagina
  const tituloPage = document.getElementById('titulo-page');
  if (tituloPage) {
    tituloPage.textContent = 'Alteração de Usuário';
  }

  // Ajusta o label do card flutuante
  const tituloEl = document.getElementById('titulo-form');
  if (tituloEl) {
    tituloEl.textContent = 'Alterar Usuário';
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
    const usuario = await getUsuarioPorId(id);

    // 5) Preencher os campos do formulário
    document.getElementById('nome').value = usuario.nome || '';
    document.getElementById('cpf').value  = usuario.cpf  || '';
    document.getElementById('setor').value  = usuario.setor_id  || '';
    document.getElementById('regiao').value = usuario.regiao_id || '';
    document.getElementById('turno').value  = usuario.turno_id  || '';
    
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
});

