export function normalizarDataNascimento(dataStr) {
  if (!dataStr) return null;

  // Se for Date (caso típico vindo do Postgres)
  if (dataStr instanceof Date) {
    // toISOString() → "2006-05-17T03:00:00.000Z" → pegamos só "2006-05-17"
    return dataStr.toISOString().slice(0, 10);
  }

  // Garante que é string
  const valor = String(dataStr).trim();

  // Mobile: "dd/mm/aaaa"
  if (valor.includes('/')) {
    const [dia, mes, ano] = valor.split('/');
    if (!dia || !mes || !ano) return null;
    return `${ano}-${mes}-${dia}`; // "aaaa-mm-dd"
  }

  // 4) Formato ISO: "aaaa-mm-dd" ou "aaaa-mm-ddT..."
  if (/^\d{4}-\d{2}-\d{2}/.test(valor)) {
    return valor.slice(0, 10); // obtem só a parte da data
  }

  // Desktop: já vem "aaaa-mm-dd"
  return valor.slice(0, 10);
}