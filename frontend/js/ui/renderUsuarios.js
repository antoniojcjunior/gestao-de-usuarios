
import { formatarMoedaBR, escapeHtml, formatCpf, formatDateToBR } from '../utils/util.js';

export function renderTabelaUsuarios(containerEl, usuarios) {
  if (!containerEl) return;

  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    containerEl.innerHTML = `
      <table id="tabela-usuarios" class="table">
        <tr>
          <td colspan="2" style="text-align:center; opacity:.7;">Nenhum usuário encontrado</td>
        </tr>
      </table>
    `;
    return;
  }
  
  // 1. Título e o contador
  const tableCaption = `
      <caption class="caption-top">
          <div class="caption-inner">
              <span>Lista de Usuários</span>
              <span class="badge bg-secondary"> ${usuarios.length}</span>
          </div>
      </caption>
  `;

  // 2. CONSTRUÇÃO DO CABEÇALHO (THEAD)
    const tableHeader = `
        <thead class="table-dark">
          <tr>
            <th class="text-center" scope="col">Nome</th>
            <th class="text-center" scope="col">CPF</th>
            <th class="text-center" scope="col">Turno</th>
            <th class="text-center" scope="col">Região</th>
            <th class="text-center" scope="col">Data de nascimento</th>
            <th class="text-center" scope="col">Remuneracao</th>
            <th class="text-center" scope="col">Ações</th>
          </tr>
        </thead>
    `;
  // 3. percorre o array e retorna uma string c/ o html de cada linha
  // <td class="col-center">${u.turno_id ?? ''}</td>
  
  const tableRows = usuarios.map(u => ` 
    <tr>
      <td class="col-left">${escapeHtml(u.nome?.toUpperCase() ?? '')}</td> 
      <td class="text-center">${formatCpf(u.cpf)}</td>
      <td class="text-center">${u.turno ?? ''}</td>
      <td class="text-center">${u.nome_regiao ?? ''}</td>
      <td class="text-center">${formatDateToBR(u.data_nascimento ?? '')}</td>
      <td class="text-end">${formatarMoedaBR(u.remuneracao)}</td>
      <td class="text-center acoes">
        <button class="btn-deletar" data-id="${u.id}" data-nome="${u.nome}" title="Excluir">
          <div class="acoes-icone">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" class="trash-icone icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>
          </div>
        <button class="btn-editar" data-id="${u.id}" data-nome="${u.nome}" title="Editar">
          <div class="acoes-icone">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="edit-icone icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>
          </div>              
      </td>
    </tr>
  `).join(''); //junta essas strings que foram retornadas a cada rodada da função map

// ?? '' o operador de coalescência nula (nullish coalescing operator).
//Significa: “se u.nome for null ou undefined, use '' (string vazia)”.
//Isso evita que apareça “undefined” ou “null” na tela.
  
// 4. COMBINAR TUDO E CRIAR A TAG <table>
  const fullTableHtml = `
    <table id="tabela-usuarios" class="table table-bordered">
        ${tableCaption} ${tableHeader}
        <tbody>
            ${tableRows}
        </tbody>
    </table>
`;
containerEl.innerHTML = fullTableHtml; //insere o codigo no HTML
}