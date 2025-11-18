// apenas as chamadas ao back

import { API_BASE } from '../config.js';

//Incluir usuário
export async function postUsuario(dadosEnviados) {
  const resposta = await fetch(`${API_BASE}/api/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosEnviados)
  });

  let dados;
  try { dados = await resposta.json(); } catch { dados = null; }

  if (!resposta.ok) {
    const msg = dados?.error || `Erro HTTP ${resposta.status}`;
    throw new Error(msg);
  }
  return dados; // sucesso
}

//Pesquisar usuarios
export async function getUsuarios(cpf = '', regiaoId = '', turnosIds = [], setorId = '', 
  nome = '', dataNascInicio = '', dataNascFim = '') {
  // usa caminho relativo ao mesmo host/porta do back
  const urlBase = `${API_BASE}/api/usuarios`;

  // 2. Constrói o objeto URL para facilitar a adição de parâmetros de query
  const url = new URL(urlBase, window.location.origin);

  // 3. Adiciona o parâmetro 'cpf' se o valor não for vazio
  if (cpf) {
    url.searchParams.append('cpf', cpf);
  }
  
  if (regiaoId) {
    url.searchParams.append('regiao', regiaoId);
  }

  if (turnosIds && turnosIds.length > 0) {
    // Junta o array de IDs em uma string separada por vírgulas (ex: "1,3,5")
    url.searchParams.append('turnos', turnosIds.join(',')); // Usa 'turnos' como nome do parâmetro
  }

  if (setorId) {
    url.searchParams.append('setor', setorId);
  }

  if (nome) {
    url.searchParams.append('nome', nome);
  }

  if (dataNascInicio) {
    url.searchParams.append('dataNascInicio', dataNascInicio);
  }
   
  if (dataNascFim) {
    url.searchParams.append('dataNascFim', dataNascFim);
  }
  const resp = await fetch(url.href);
  if (!resp.ok) {
    throw new Error(`Erro ao buscar usuários (${resp.status})`);
  }
  
  //const volta = await resp.json();
  //console.log('Resposta do Fetch:', volta);
  return resp.json(); // [{ id, nome, cpf, ... }]
  
  
}

export async function getUsuarioPorId(id) {
  try {
    // 1. Verificação rápida do ID
    if (!id || isNaN(Number(id))) {
      throw new Error('ID inválido.');
    }

    // 2. Chamada do endpoint específico
    const resposta = await fetch(`${API_BASE}/api/usuarios/${id}`);

    // 3. Tratamento de erro HTTP
    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => ({}));
      // 404, 400, 500 -> todos tratados aqui
      throw new Error(erro.error || 'Falha ao buscar usuário.');
    }

    // 4. Retorno do registro único
    const dados = await resposta.json();
    //console.log(dados);
    console.log("retorno do getusuario por id:", dados);
    return dados;  // objeto { id, nome, cpf, ... }

  } catch (err) {
    console.error('Erro em getUsuarioPorId:', err);
    throw err; // permite que o caller trate o erro
  }
}
/**
 * Envia uma requisição DELETE para a API e remove um usuário pelo ID.
 * @param {string | number} usuarioId O ID do usuário a ser deletado.
 * @returns {Promise<boolean>} Retorna true se a deleção foi bem-sucedida (Status 204).
 */
export async function deleteUsuario(usuarioId) {
    // 1. Constrói a URL usando template literal e o ID
    const url = `${API_BASE}/api/usuarios/${usuarioId}`; 

    try {
        const response = await fetch(url, {
            method: 'DELETE', // Método DELETE
            // Headers de segurança ou autenticação podem ir aqui
        });

        // 2. Verifica o status da resposta: 204 No Content para deleção bem-sucedida
        if (response.status === 204) {
            return true; // Sucesso
        } 
        
        // 3. Trata erros (4xx e 5xx)
        else {
            // Se o backend enviar um corpo JSON com erro, tentamos lê-lo
            let errorDetail = `Status ${response.status}`;
            if (response.headers.get('content-type')?.includes('application/json')) {
                const errorBody = await response.json(); 
                errorDetail = errorBody.error || errorDetail;
            }
            
            console.error(`Falha ao deletar usuário ID ${usuarioId}. Detalhe: ${errorDetail}`);
            return false;
        }

    } catch (error) {
        // Captura erros de rede
        console.error('Erro de rede/execução ao tentar deletar o usuário:', error);
        return false;
    }
}

export async function atualizarUsuario(id, usuario) {
  // 1. Garante que o ID e os dados existam
  console.log('ID da API', id);
  if (!id || !usuario) {
    throw new Error('ID ou dados do usuário ausentes para atualização.');
  }

  try {
    const resposta = await fetch(`${API_BASE}/api/usuarios/${id}`, {
      method: 'PUT', // Especifica o método HTTP
      headers: {
        'Content-Type': 'application/json'
      },
      // Converte o objeto JavaScript em uma string JSON para o corpo da requisição
      body: JSON.stringify(usuario) 
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => ({}));
      // Trata erros 400, 404, 500, etc.
      throw new Error(erro.error || 'Falha na atualização do usuário.');
    }

    // O PUT tipicamente retorna o registro atualizado (Status 200) ou apenas sucesso (204 No Content)
    // Se o backend retornar 204, a chamada 'await resposta.json()' pode falhar.
    // Para simplificar, assumimos que o backend pode retornar 200 com o objeto atualizado.
    if (resposta.status === 200) {
        return await resposta.json();
    }
    
    // Retorna true em caso de sucesso sem corpo (204 No Content)
    return true; 

  } catch (err) {
    console.error('Erro em atualizarUsuario:', err);
    throw err; // Permite que o caller trate o erro e exiba a mensagem
  }
}