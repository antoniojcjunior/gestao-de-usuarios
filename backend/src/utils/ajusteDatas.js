export function normalizarDataNascimento(dataStr) {
  if (!dataStr) return null;

  // Mobile: "dd/mm/aaaa"
  if (dataStr.includes('/')) {
    const [dia, mes, ano] = dataStr.split('/');
    if (!dia || !mes || !ano) return null;
    return `${ano}-${mes}-${dia}`; // "aaaa-mm-dd"
  }

  // Desktop: já vem "aaaa-mm-dd"
  return dataStr;
}