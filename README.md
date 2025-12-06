# Gestão de Usuários

Projeto para gerenciamento e pesquisa de usuários, composto por front-end estático e uma API back-end em Node.js/Express conectada a um banco PostgreSQL.

## Visão geral

Este repositório contém duas partes principais:
- `backend/` — API REST em Node.js (ES Modules) usando Express e PostgreSQL (driver `pg`).
- `frontend/` — páginas estáticas (HTML/CSS/JS) que consomem a API para pesquisar, criar, editar e excluir usuários.

O front-end é uma aplicação tradicional sem bundlers, organizada em arquivos estáticos que carregam módulos ES via `type="module"`.

## Tecnologias

- Node.js (requerido: >= 18)
- Express (v5.x)
- PostgreSQL (driver `pg`)
- CORS, dotenv
- Front-end: HTML, Bootstrap 5, Tom Select, Vanilla Masker, JS modular (ES modules)

## Estrutura principal do repositório

```
gestao-de-usuarios/
├─ backend/
│  ├─ package.json
│  └─ src/
│     ├─ server.js
│     └─ utils/
│        ├─ ajusteDatas.js
│        └─ comparaRegistros.js
├─ frontend/
│  ├─ index.html
│  ├─ components/
│  │  ├─ header.html
│  │  └─ footer.html
│  ├─ assets/
│  │  ├─ css/
│  │  └─ lib/ (bootstrap, tom-select, vanilla-masker)
│  └─ src/
│     ├─ main/
│     │  └─ pesquisa.main.js
│     └─ utils/
```

Nota: esta árvore foca nos arquivos de maior impacto. Existem outros arquivos e utilitários no frontend usados para carregar componentes, máscaras e auxiliar a interface.

## Dependências (backend)

Arquivo: `backend/package.json`

- express@^5.1.0
- pg@^8.16.3
- cors@^2.8.5
- dotenv@^17.2.3

Scripts úteis:

- `npm start` — inicia o servidor com `node src/server.js`.

## Variáveis de ambiente

O backend usa `dotenv` e espera pelo menos as seguintes variáveis no ambiente (arquivo `.env` recomendado na raiz de `backend/`):

- `DATABASE_URL` — string de conexão com o PostgreSQL (ex: `postgres://user:pass@host:port/dbname`).
- `PORT` — porta opcional para o servidor (padrão: `3000`).
- `NODE_ENV` — pode ser usado para forçar comportamento de `isLocal` (ex: `development`).

Observação: O servidor ajusta `ssl` na conexão com base em `DATABASE_URL` e `NODE_ENV`.

## Banco de dados / Observações SQL

O `server.js` interage com as tabelas a seguir (nomes usados nas queries):

- `usuarios` — campos referenciados: `id, nome, cpf, setor_id, regiao_id, turno_id, data_nascimento, remuneracao`
- `turnos` — usado para buscar `turno` (JOIN)
- `regioes` — usado para buscar nome da região (JOIN)
- `setores` — usado para buscar `nome` e `sigla` do setor (JOIN)

As queries no código assumem que essas tabelas existem com os relacionamentos de chave estrangeira entre `usuarios.setor_id`, `usuarios.regiao_id`, `usuarios.turno_id` e as tabelas correspondentes.

## Endpoints da API

Base: `/api`

- `POST /api/usuarios` — criar novo usuário. Campos esperados no body: `nome`, `cpf`, `setor_id`, `regiao_id`, `turno_id`, `data_nascimento`, `remuneracao`.
- `DELETE /api/usuarios/:id` — exclui usuário por ID.
- `GET /api/usuarios/:id` — busca usuário por ID.
- `GET /api/usuarios` — lista usuários com filtros opcionais via query string: `cpf`, `regiao`, `turnos` (lista csv), `setor`, `nome` (LIKE), `dataNascInicio`, `dataNascFim`.
- `PUT /api/usuarios/:id` — atualiza usuário por ID; body com campos semelhantes ao POST.
- `GET /api/setores` — retorna `id, nome, sigla` de setores.
- `GET /api/regioes` — retorna `id, nome` de regiões.
- `GET /api/turnos` — retorna `id, turno` dos turnos.

O servidor realiza validações: CPF com 11 dígitos, campos obrigatórios, conversão de `remuneracao` (formato `R$ 1.234,56` → número), e tratamento de erros do Postgres (ex.: `23505` duplicidade de CPF, `23503` foreign key).

## Front-end

O frontend é composto por páginas estáticas e scripts modulares. A página principal é `frontend/index.html` (Pesquisar Usuários) que carrega recursos:

- `Bootstrap 5` via CDN com fallback local em `assets/lib`.
- `Tom Select` para selects avançados com fallback local.
- `Vanilla Masker` para máscaras de input.
- Scripts principais em `frontend/src/main/` (ex.: `pesquisa.main.js`) e utilitários em `frontend/src/utils/` como `include-html.util.js` para incluir componentes HTML.

Como rodar o frontend localmente:

1. Servir a pasta `frontend/` com um servidor estático (por exemplo, `npx http-server frontend` ou abrir `index.html` diretamente no navegador). Alguns recursos funcionam melhor servindo via HTTP em vez de `file://`.
2. Garantir que a API backend esteja rodando e acessível (ver variáveis de ambiente e CORS).

Observação: As páginas já implementam lógica para usar CDNs com fallback local para os assets (bootstrap, tom-select, vanilla-masker), portanto é possível executar offline se os arquivos de `assets/lib` estiverem presentes.

## Instalação e execução (exemplo)

1. Backend

```bash
cd backend
npm install
# criar arquivo .env com DATABASE_URL e opcionalmente PORT
npm start
```

2. Frontend

```bash
# Em um terminal separado, servir a pasta frontend
npx http-server frontend -p 8080
# ou abrir frontend/index.html diretamente
```

## Boas práticas e observações

- Garanta que o banco PostgreSQL esteja disponível e que `DATABASE_URL` aponte corretamente. Em ambientes de produção o `ssl` será habilitado conforme a lógica do servidor.
- Verifique as constraints e índices no banco (ex.: índice unique para `cpf`) para manter integridade e performance.
- Os utilitários em `backend/src/utils` contêm funções de normalização de datas e comparação de registros; são usados para validar e normalizar dados antes de gravar no banco.

## Onde olhar no código

- API principal: `backend/src/server.js`
- Normalização/validações: `backend/src/utils/ajusteDatas.js`, `backend/src/utils/comparaRegistros.js`
- Frontend: `frontend/index.html`, `frontend/src/main/pesquisa.main.js`, `frontend/src/utils/include-html.util.js` e `frontend/components/` para header/footer.

## Contato

Para maiores detalhes sobre implementação ou dúvidas, consulte o autor/maintainer do projeto no repositório original.

