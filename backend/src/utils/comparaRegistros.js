// utils/comparaRegistros.js (por exemplo)

import { normalizarDataNascimento } from './ajusteDatas.js';

function normalizarRemuneracao(origemRem) {
  if (origemRem === undefined || origemRem === null || origemRem === '') {
    return null;
  }

  const valor = String(origemRem).trim();

  if (!valor) return null;

  let limpo;

  if (valor.includes(',')) {
    // 🔹 Formato BR: "R$ 1.500,00"
    // - remove R$, espaços e pontos de milhar
    // - mantém a vírgula como decimal e depois troca por ponto
    limpo = valor.replace(/[R$\s.]/g, '').replace(',', '.');
  } else {
    // 🔹 Formato "interno"/banco: "1500.00" ou "1500"
    // - remove só R$ e espaços; NÃO remove o ponto decimal
    limpo = valor.replace(/[R$\s]/g, '');
  }

  const numero = Number(limpo);
  return Number.isNaN(numero) ? null : numero;
}

export function comparaRegistros(registroAtualBanco, dadosNovosReq) {
  // 🔹 Mesma lógica de normalização que você usa no POST
  const normalizar = (origem = {}) => {
    const cpfLimpo = String(origem.cpf || '').replace(/\D/g, ''); // só dígitos

    const nomeTrim = String(origem.nome || '').trim();

    const setorIdNum =
      origem.setor_id !== undefined && origem.setor_id !== null
        ? Number(origem.setor_id)
        : null;

    const regiaoIdNum =
      origem.regiao_id !== undefined && origem.regiao_id !== null
        ? Number(origem.regiao_id)
        : null;

    const turnoIdNum =
      origem.turno_id !== undefined && origem.turno_id !== null
        ? Number(origem.turno_id)
        : null;

    // Usa exatamente a MESMA função que você já usa no POST
    const dataNormalizada = origem.data_nascimento
      ? normalizarDataNascimento(origem.data_nascimento)
      : null;

    const remunNumerica = normalizarRemuneracao(origem.remuneracao);

    return {
      cpf: cpfLimpo,
      nome: nomeTrim,
      setor_id: setorIdNum,
      regiao_id: regiaoIdNum,
      turno_id: turnoIdNum,
      data_nascimento: dataNormalizada,
      remuneracao: remunNumerica,
    };
  };

  // 🔹 Normaliza registro que veio do banco
  const atual = normalizar({
    cpf: registroAtualBanco.cpf,
    nome: registroAtualBanco.nome,
    setor_id: registroAtualBanco.setor_id,
    regiao_id: registroAtualBanco.regiao_id,
    turno_id: registroAtualBanco.turno_id,
    data_nascimento: registroAtualBanco.data_nascimento,
    remuneracao: registroAtualBanco.remuneracao,
  });

  // 🔹 Normaliza o que veio do req.body (PUT)
  const novo = normalizar(dadosNovosReq);

  const campos = Object.keys(atual);

  const mesmosDados = campos.every((campo) => atual[campo] === novo[campo]);

  const camposAlterados = mesmosDados
    ? []
    : campos.filter((campo) => atual[campo] !== novo[campo]);

  return {
    mesmosDados,
    camposAlterados,
    atual,
    novo,
  };
}
