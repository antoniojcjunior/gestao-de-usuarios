export async function carregarSelect({ url, selectId, labelCampo = 'nome' }) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Falha na resposta de ${url}`);
    const dados = await resp.json();

    const select = document.getElementById(selectId);
    if (!select) return;

    const texto = select.dataset.placeholder || '-- Escolha uma opção --';
    select.innerHTML = `<option value="" disabled selected>${texto}</option>`;

    dados.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = item[labelCampo];
      select.appendChild(opt);
    });

    console.log(`${selectId} consultado com sucesso!`);
  } catch (err) {
    console.error(`Erro ao carregar ${selectId}:`, err);
  }
}

// Use esta função SOMENTE para <select multiple> com Tom Select
export async function carregarSelectMultiplo({
  url,
  selectId,
  labelCampo = 'descricao',
  valueCampo = 'id',
  placeholder = 'Selecione',
  preselecionados = [] // pode passar ['1','3'] por exemplo
}) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Falha na resposta de ${url}`);
    const dados = await resp.json();
    console.log('Retorno select multiplo');
    console.log(dados);

    const el = document.getElementById(selectId);
    if (!el) return;

    // se já havia um Tom Select, destruir antes de recriar
    if (el.tomselect) {
      el.tomselect.destroy();
    }

    // limpa e garante múltiplo
    el.multiple = true;
    el.innerHTML = '';

    // monta opções a partir do retorno da API
    dados.forEach(item => {
      const opt = document.createElement('option');
      opt.value = String(item[valueCampo]);
      opt.textContent = item[labelCampo];
      if (preselecionados.includes(String(opt.value))) opt.selected = true;
      el.appendChild(opt);
    });

    // cria a instância do Tom Select
    const tom = new TomSelect(el, {
      placeholder,
      maxItems: null,
      create: false,
      persist: false,
      closeAfterSelect: false,
      plugins: ['remove_button'],
      render: {
        item: (data, escape) => `<div>${escape(data.text)}</div>`,
        option: (data, escape) => `<div>${escape(data.text)}</div>`
      }
    });

    // placeholder some automaticamente após selecionar
    tom.on('item_add', () => {
        // esconde o placeholder imediatamente após selecionar
      tom.control_input.placeholder = '';
      tom.settings.placeholder = '';
    });

    // placeholder volta quando tudo for removido
    tom.on('item_remove', () => {
      if (tom.items.length === 0) {
        tom.control_input.placeholder = placeholder;
        tom.settings.placeholder = placeholder;
      }
    });

    console.log(`${selectId} (múltiplo) carregado com sucesso!`);
  } catch (err) {
    console.error(`Erro ao carregar ${selectId} (múltiplo):`, err);
  }
}