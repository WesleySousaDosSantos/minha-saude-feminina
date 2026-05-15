Minha Saúde Feminina — Backend

API institucional do projeto, feita em Next.js (App Router) com Prisma e Postgres.

Stack

Next.js 15 com TypeScript, Prisma ORM, PostgreSQL, JWT para autenticação, bcryptjs para senhas e Zod para validação.

O serviço expõe rotas REST em /api/* e uma página inicial simples só pra confirmar que está no ar.

Pré-requisitos

Node.js 20 ou superior e Postgres 14 ou superior rodando localmente (ou em qualquer servidor que aceite uma DATABASE_URL).

Configuração inicial

Copie o arquivo de variáveis de exemplo e ajuste com seus dados:

cp .env.example .env

Depois edite o .env com a DATABASE_URL apontando para seu Postgres e troque o JWT_SECRET por uma string longa e aleatória (qualquer gerador serve). Em desenvolvimento o CORS_ORIGIN pode ficar em * mesmo.

Crie o banco antes de rodar as migrations. Pelo psql:

createdb minha_saude_feminina

Ou pelo cliente do Windows usando a conta postgres padrão, ajustando o nome conforme sua instalação.

Instalando e migrando

npm install
npx prisma generate
npx prisma migrate dev --name init

Rodando

npm run dev

O servidor sobe em http://localhost:3000. Acesse /api/health para confirmar que está conectado no banco.

Endpoints disponíveis

Autenticação:
POST /api/auth/register cria conta nova (body: name, email, password, termsAccepted)
POST /api/auth/login devolve token JWT (body: email, password)
GET /api/auth/me retorna dados da usuária autenticada (header Authorization Bearer <token>)
PATCH /api/auth/me atualiza nome, telefone, data de nascimento e senha
DELETE /api/auth/me remove a conta e tudo associado
POST /api/auth/forgot-password sempre devolve sucesso por segurança (o disparo real do email vem depois)

Ciclo:
GET /api/cycle retorna as configurações de ciclo da usuária
PUT /api/cycle cria ou atualiza (body: lastPeriodStart, cycleDuration, periodDuration)

Registros diários:
GET /api/registros lista os registros, aceita query string ?from=YYYY-MM-DD&to=YYYY-MM-DD
POST /api/registros cria ou atualiza o registro de uma data (upsert por userId+date)
GET /api/registros/:id pega um registro específico
PATCH /api/registros/:id atualiza campos parcialmente
DELETE /api/registros/:id remove

Lembretes:
GET /api/lembretes lista, aceita ?completed=true|false
POST /api/lembretes cria novo
GET /api/lembretes/:id pega um
PATCH /api/lembretes/:id atualiza (inclui o campo completed)
DELETE /api/lembretes/:id remove

Saúde do serviço:
GET /api/health confirma que o app está rodando e o banco está acessível

Autenticação

Toda rota que não seja /api/auth/* e /api/health exige header Authorization no formato Bearer <token>. O token vem da resposta de /api/auth/register ou /api/auth/login. Por padrão expira em 7 dias.

Estrutura do banco

User tem dados básicos da usuária. CycleSettings é 1 para 1 com User e guarda a base de cálculo do ciclo. Registro é 1 para muitos a partir de User e única por data (um registro por dia). Lembrete também é 1 para muitos a partir de User. Ao deletar um User, o Prisma apaga em cascata tudo associado.

Comandos úteis do Prisma

npx prisma studio abre uma UI web em http://localhost:5555 para inspecionar e editar dados
npx prisma migrate reset apaga tudo e roda as migrations do zero (cuidado em produção)
npx prisma db push sincroniza o schema sem gerar migration formal (útil em prototipagem)

Notas de implementação

Senhas são guardadas como hash bcrypt com 12 rounds, nunca em texto puro. O JWT é assinado com HS256 usando o JWT_SECRET. CORS está aberto em desenvolvimento pra facilitar o desenvolvimento mobile, mas deve ser restringido em produção via CORS_ORIGIN. As validações de entrada usam Zod e devolvem mensagens em português quando o corpo da requisição é inválido.

Próximos passos

Plugar as chamadas no frontend Expo (substituir os mocks do React Query pelas queries reais), adicionar um seed inicial pra desenvolvimento, e configurar deploy num provedor de Postgres gerenciado para o piloto na UBS.
