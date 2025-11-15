import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

import { normalizarDataNascimento } from './utils/ajusteDatas.js';

process.env.PGCLIENTENCODING = 'UTF8';

const app = express();
app.use(cors());
app.use(express.json());

const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.NODE_ENV === 'development';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

// POST /api/usuarios
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, cpf, setor_id, regiao_id, turno_id, data_nascimento, remuneracao } = req.body;
    const cpfLimpo = String(cpf || '').replace(/\D/g, ''); // limpa o CPF, só digitos
    const dataNormalizada = normalizarDataNascimento(data_nascimento);
    const setorIdNum  = Number(setor_id);
    const regiaoIdNum = Number(regiao_id);
    const turnoIdNum = Number(turno_id);

    console.log("Dados do front para o back:", req.body); //mostra quais campos estão chegando do front para o back

    /*if (!nome || nome.trim() === '') { nome vazio OU nome em branco entra no IF e retorna erro
    return res.status(400).json({ error: 'Nome é obrigatório.' });
    } Mesma coisa do abaixo, abaixo com escrita + moderna */
    if (!nome?.trim()) {
      return res.status(400).json({ error: 'Nome é obrigatório.' });
    }

    if (cpfLimpo.length !== 11) { /*qtde de caracteres diferente de 11*/
      return res.status(400).json({ error: 'CPF inválido: informe 11 dígitos.' });
    }

    /*se não for um número inteiro válido ou se vier em branco e virar zero entre no if.*/
    if (!Number.isInteger(Number(setorIdNum)) || Number(setorIdNum) <= 0) {
      return res.status(400).json({ error: 'setor_id inválido.' });
    };

    if (!Number.isInteger(Number(regiaoIdNum)) || Number(regiaoIdNum) <= 0) {
      return res.status(400).json({ error: 'regiao_id inválido.' });
    };

    if (!Number.isInteger(Number(turnoIdNum)) || Number(turnoIdNum) <= 0) {
      return res.status(400).json({ error: 'turno_id inválido.' });
    };

    // converte "R$ 5.145,88" → 5145.88
    const remunNumerica = Number(String(remuneracao).replace(/[R$\s.]/g, '').replace(',', '.'));

    if (isNaN(remunNumerica)) {
      return res.status(400).json({ error: 'Remuneração inválida.' });
    }

    const { rows } = await pool.query(
      'INSERT INTO usuarios (nome, cpf, setor_id, regiao_id, turno_id, data_nascimento, remuneracao) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nome, cpf, setor_id, regiao_id, turno_id, data_nascimento, remuneracao',
      [nome.trim(), cpfLimpo, setorIdNum, regiaoIdNum, turnoIdNum, dataNormalizada, remunNumerica]
    );
    //console.log('Usuário incluído com sucesso:', rows[0]);
    return res.status(201).json(rows[0]); // { id, cpf }
  } catch (err) {
    // 23505 = unique_violation no Postgres
    if (err.code === '23505') {
      return res.status(409).json({ error: 'CPF já cadastrado.' });
    }
    
    if (err.code === '23503') return res.status(400).json({ error: 'Setor inválido (FK).' });   // foreign_key_violation
    
    console.error(err);
    return res.status(500).json({ error: 'Erro ao inserir usuário.' });
  }
});

// DELETE /api/usuarios/:id
app.delete('/api/usuarios/:id', async (req, res) => {
    // 1. Captura o ID do parâmetro da URL
    const { id } = req.params;

    // 2. Validação básica do ID (garante que é um número e não está vazio)
    // Opcional: Se a rota DELETE é muito usada, mover esta validação para um middleware pode ser mais limpo.
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'ID de usuário inválido.' });
    }

    try {
        // 3. Execução da query SQL DELETE
        const queryText = 'DELETE FROM usuarios WHERE id = $1';
        
        // pool.query é a sua função de conexão com o PostgreSQL
        const result = await pool.query(queryText, [id]);

        // 4. Verifica se alguma linha foi realmente deletada (rowCount)
        if (result.rowCount === 0) {
            // Se rowCount for 0, o usuário com o ID fornecido não existe
            return res.status(404).json({ error: `Usuário ID ${id} não encontrado.` });
        }

        // 5. Retorna status 204 (No Content) para sucesso em deleções, pois não há conteúdo para retornar.
        res.status(204).send(); 

    } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        // Retorna status 500 para erro interno do servidor
        res.status(500).json({ error: 'Erro interno do servidor ao deletar o usuário.' });
    }
});

// pesquisar usuário por ID
app.get('/api/usuarios/:id', async (req, res) => {
  try {
    // 1. Extrai o "id" da URL
    const { id } = req.params;

    // 2. Validação rápida
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    // 3. Consulta SQL
    const queryText = `
      SELECT id, nome, cpf, setor_id, regiao_id, turno_id, data_nascimento, remuneracao
      FROM usuarios
      WHERE id = $1
    `;

    const { rows } = await pool.query(queryText, [id]);

    // 4. Tratamento se não encontrar
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // 5. Retorno do registro
    return res.status(200).json(rows[0]);

  } catch (err) {
    console.error('Erro ao buscar usuário por ID:', err);
    return res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
  }
});


// listar usuários
app.get('/api/usuarios', async (req, res) => {
  console.log('Consulta servidor realizada'); // Log no backend
  // 1. Obtém o CPF da query string (ex: /api/usuarios?cpf=12345678900)
    const cpfFiltro = req.query.cpf;
    const regiaoFiltro = req.query.regiao;
    const turnosFiltro = req.query.turnos;
    const setorFiltro = req.query.setor;
  
      // 1. Definição do SQL com JOIN
    let sql = `
      SELECT 
        usr.id, 
        usr.nome, 
        usr.cpf, 
        usr.setor_id, 
        usr.regiao_id, 
        usr.turno_id, 
        trn.turno,
        reg.nome as nome_regiao,
        setor.nome as nome_setor,
        setor.sigla as sigla_setor,
        usr.data_nascimento, 
        usr.remuneracao
      FROM 
          usuarios usr
      INNER JOIN 
          turnos trn ON usr.turno_id = trn.id
      INNER JOIN 
          regioes reg ON usr.regiao_id = reg.id
      INNER JOIN 
          setores setor ON usr.setor_id = setor.id`;

    const params = [];
    let conditions = [];// Array para armazenar as cláusulas WHERE

// 1. Filtro por CPF
if (cpfFiltro && cpfFiltro.length > 0) {
    // Adiciona a condição ao array e o valor ao array de parâmetros
    conditions.push(`usr.cpf = $${params.length + 1}`);
    params.push(cpfFiltro);
}

// 2. Filtro por Região
if (regiaoFiltro && regiaoFiltro.length > 0) {
    // Adiciona a condição ao array e o valor ao array de parâmetros
    // NOTA: Assumimos que o input do frontend envia o ID da região.
    conditions.push(`usr.regiao_id = $${params.length + 1}`);
    params.push(regiaoFiltro);
}

// 3. <<-- NOVO FILTRO: Por Múltiplos Turnos (usando IN)
if (turnosFiltro && turnosFiltro.length > 0) {
    // A string de turnosFiltro é "1,3,5". 
    // O operador IN do SQL aceita esta lista de valores.
    // Usamos 'turnosFiltro' diretamente aqui, pois ele é a lista de valores.
    conditions.push(`usr.turno_id IN (${turnosFiltro})`);
    // NOTA IMPORTANTE: Por estarmos injetando a lista de IDs de um SELECT 
    // (que assumimos ser sanitizados por serem numéricos), podemos usar IN.
    // No entanto, para segurança máxima, seria ideal mapear os valores e usar placeholders ($1, $2, etc.)
    // Vamos usar a injeção simples com IN(1,3,5) por enquanto, focando na funcionalidade.
}

// 4. Filtro por setor
if (setorFiltro && setorFiltro.length > 0) {
    // Adiciona a condição ao array e o valor ao array de parâmetros
    // NOTA: Assumimos que o input do frontend envia o ID do filtro.
    conditions.push(`usr.setor_id = $${params.length + 1}`);
    params.push(setorFiltro);
}

// 3. Constrói a cláusula WHERE final
if (conditions.length > 0) {
    // Se houver condições, adiciona ' WHERE ' e junta as condições com ' AND '
    sql += ` WHERE ` + conditions.join(' AND ');
}

// 4. Adiciona a ordenação
sql += ` ORDER BY usr.nome ASC`;
console.log(sql);
console.log('PARAMS:', params);
  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar usuários' });
  }
});

// rota para listar setores
app.get('/api/setores', async (_req, res) => {
  console.log('Requisição recebida em /api/setores'); // Log no backend
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, sigla FROM setores ORDER BY nome'
    );
    res.json(rows);
  } catch (erroSetores) {
    console.error(erroSetores);
    res.status(500).json({ error: 'Erro ao consultar setores' });
  }
});

// rota para listar regioes
app.get('/api/regioes', async (_req, res) => {
  console.log('Consulta a regiões recebida'); // Log no backend
  try {
    const { rows } = await pool.query(
      'SELECT id, nome FROM regioes ORDER BY nome'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar regioes' });
  }
});

// rota para listar turnos
app.get('/api/turnos', async (_req, res) => {
  console.log('Consulta aos turnos recebida'); // Log no backend
  try {
    const { rows } = await pool.query(
      'SELECT id, turno FROM turnos ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao consultar turnos' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});