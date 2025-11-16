export async function carregarSelect({ url, selectId, labelCampo = 'nome', montarLabel }) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Falha na resposta de ${url}`);
    const dados = await resp.json();

    const select = document.getElementById(selectId);
    if (!select) return;

    const obrigatorio = select.dataset.obrigatorio === 'true';
    const texto = select.dataset.placeholder || '-- Escolha uma opção --';
    if (obrigatorio) {
      // formulário de inclusão: usuário é obrigado a escolher
      select.innerHTML = `<option value="" disabled selected>${texto}</option>`; //mostra o texto q vc definiu no html
    } else {
      // página de pesquisa: usuário pode "desmarcar" voltando para (nenhuma)
      select.innerHTML = `<option value="">${texto}</option>`;
      }
    
    dados.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
       // Se tiver callback, usa ele; se não, volta pro campo simples
      if (typeof montarLabel === 'function') {
        opt.textContent = montarLabel(item); // ex.: "PLAN — Planejamento"
      } else {
        opt.textContent = item[labelCampo];
      }
      select.appendChild(opt);
    });

    console.log(`${selectId} consultado com sucesso!`);
  } catch (err) {
    console.error(`Erro ao carregar ${selectId}:`, err);
  }
}

//Select com Filtro TomSelect
export function selectFilter(elementId) {
  const selectElement = document.getElementById(elementId);
    
  if (selectElement) {
      const tomSelectInstance = new TomSelect(selectElement, {
          create: false,
          sortField: {
              field: "text",
              direction: "asc"
          }
      });
      tomSelectInstance.on('item_add', () => {
          // Força o campo de entrada (input) do Tom Select a perder o foco.
          tomSelectInstance.blur();
      });

      // 3. ATENÇÃO: Retorno do objeto
      // O Tom Select anexa a si mesmo ao elemento DOM, mas a forma mais limpa é retornar
      // a instância diretamente que acabamos de criar.
      return tomSelectInstance;
    }
  return null;
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

    // pega o fallback, se existir (id no padrão: <id>-fallback)
    const fallback = document.getElementById(`${selectId}-fallback`);

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

    // troca visual – esconde fallback e mostra o Tom Select pronto
    if (fallback) {
      fallback.classList.add('d-none');   // esconde o select original Bootstrap
    }
    // mostra o wrapper do Tom Select (que herdou d-none do select original)
    if (tom.wrapper) {
      tom.wrapper.classList.remove('d-none');
    }
    // o select original pode continuar escondido, o Tom Select já usa ts-hidden-accessible

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