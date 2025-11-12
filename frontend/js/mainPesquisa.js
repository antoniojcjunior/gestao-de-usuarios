import { initPesquisaPage } from './pages/pesquisaPage.js';
import { configurarDelecaoDeUsuarios } from './pages/pesquisaPage.js';
import { aplicarMascaraCPF } from './utils/util.js';
import { carregarSelectMultiplo, carregarSelect } from './utils/carregarSelect.js';
//import { initModalEditarUsuario } from './pages/modalEditarUsuario.js';

const API_BASE = 'http://localhost:3000'; // ajuste aqui se trocar host/porta

/*document.addEventListener('DOMContentLoaded', carregarSetores); /*chama a função carregarSetores depois que o HTML temrina de carregar*/
document.addEventListener('DOMContentLoaded', () => {
  initPesquisaPage();//essa função ativa o listener do botão pesquisar
  configurarDelecaoDeUsuarios();//essa função ativa o listener do botão Lixeira apagar
  aplicarMascaraCPF();
  carregarSelect({ url: `${API_BASE}/api/setores`, selectId: 'setor' });
  carregarSelect({ url: `${API_BASE}/api/regioes`, selectId: 'regiao' });
  carregarSelect({ url: `${API_BASE}/api/turnos`, selectId: 'turnos', labelCampo: 'turnos' });
  carregarSelectMultiplo({
  url: `${API_BASE}/api/turnos`,
  selectId: 'turnos-multi',
  placeholder: 'Selecione',
  labelCampo: 'turno',
  // preselecionados: ['2','3'] // se quiser iniciar com valores marcados
});

//initModalEditarUsuario() //Chama o modal

  //Listener Botão novoUsuario
  const btnPesquisa = document.getElementById('novoUsuario');
  btnPesquisa.addEventListener('click', (e) => {
    window.location.href = "./pages/usuarioform.html";
  });
});
