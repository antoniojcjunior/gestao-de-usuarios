import { initPesquisaPage, configurarDelecaoDeUsuarios } from '../pages/pesquisa/pesquisa.page.js';
import { aplicarMascaraCPF, limparFormulario } from '../utils/util.util.js';
import { carregarSelectMultiplo, carregarSelect, selectFilter } from '../utils/carregar-select.util.js';
import { setupModalFocusFix } from '../utils/modal-focus-handler.util.js';
// import { initModalEditarUsuario } from '../pages/usuarios/modal-editar-usuario.page.js';

import { API_BASE } from '../config.js';

/*document.addEventListener('DOMContentLoaded', carregarSetores); /*chama a função carregarSetores depois que o HTML temrina de carregar*/
document.addEventListener('DOMContentLoaded', async () => {
  initPesquisaPage();//essa função ativa o listener do botão pesquisar
  configurarDelecaoDeUsuarios();//essa função ativa o listener do botão Lixeira apagar
  aplicarMascaraCPF();
  await Promise.all([
  carregarSelect({ url: `${API_BASE}/api/setores`, selectId: 'setor', montarLabel: (item) => `${item.sigla} — ${item.nome}` }),
  carregarSelect({ url: `${API_BASE}/api/regioes`, selectId: 'regiao' }),
  carregarSelect({ url: `${API_BASE}/api/turnos`, selectId: 'turnos', labelCampo: 'turnos' })
  ]);
  carregarSelectMultiplo({
  url: `${API_BASE}/api/turnos`,
  selectId: 'turnos-multi',
  placeholder: 'Selecione',
  labelCampo: 'turno',
  });
  selectFilter('setor');
  setupModalFocusFix();
//initModalEditarUsuario() //Chama o modal

  const btnLimpar = document.getElementById('limpar');
    btnLimpar.addEventListener('click', (e) => {
      e.preventDefault();
      limparFormulario(); // chama a função acima
    });
  //Listener Botão novoUsuario
  const btnPesquisa = document.getElementById('novoUsuario');
  btnPesquisa.addEventListener('click', (e) => {
    window.location.href = "src/pages/usuarios/usuarioform.html";
  });
});
