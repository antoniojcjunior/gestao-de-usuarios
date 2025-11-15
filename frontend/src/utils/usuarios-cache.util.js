// 🔒 Variável privada (não exportada)
let cacheUsuarios = [];

/**
 * 🔹 Armazena a lista de usuários no cache
 * @param {Array} lista - Lista de usuários retornada da API
 */
export function setUsuariosCache(lista) {
  cacheUsuarios = Array.isArray(lista) ? lista : [];
}

/**
 * 🔹 Retorna o cache completo (array de usuários)
 * @returns {Array}
 */
export function getUsuariosCache() {
  return cacheUsuarios;
}

/**
 * 🔹 Busca um usuário pelo ID dentro do cache
 * @param {number|string} id - ID do usuário
 * @returns {Object|null} - Usuário encontrado ou null
 */
export function getUsuarioPorId(id) {
  if (!cacheUsuarios.length) return null;
  return cacheUsuarios.find(u => String(u.id) === String(id)) || null;
}

/**
 * 🔹 Limpa completamente o cache
 */
export function clearUsuariosCache() {
  cacheUsuarios = [];
}