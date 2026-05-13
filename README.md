# Minha Saúde Feminina

Aplicativo móvel de saúde da mulher, desenvolvido em parceria entre os cursos de Medicina e Sistemas de Informação da UNIFEBE.

O app é uma ferramenta de autocuidado e educação. Ele complementa o atendimento da Unidade Básica de Saúde (UBS), mas nunca substitui uma avaliação médica.

Este é um projeto institucional, pensado para uso real nos postinhos de saúde.

## Sobre

A proposta é acompanhar a mulher em todas as fases da vida: adolescência, idade adulta, gestação e pós-parto, climatério, menopausa e senescência. Também atende mulheres com condições crônicas e quem está tentando engravidar.

Entre as funcionalidades previstas estão:

- Acompanhamento do ciclo menstrual e da janela fértil
- Registro diário de sintomas, humor e bem-estar
- Conteúdo educativo validado por profissionais de saúde
- Orientações sobre quando procurar a UBS
- Espaço para perguntas anônimas ("É normal isso?")
- Informações sobre violência contra a mulher (Violentômetro)

## Foco atual

O foco neste momento é o aplicativo mobile. O backend e o admin web são desenvolvidos em paralelo, mas a entrega prioritária é o app rodando como APK Android para o pessoal das UBS testar.

## Tecnologias

O frontend é feito em Expo (React Native) e fica na pasta `frontend/`.

O backend é em Next.js com Prisma como ORM e Postgres como banco, na pasta `backend/`. O mesmo projeto Next.js serve a API consumida pelo app e, depois, as páginas do admin web para os profissionais de saúde. O Postgres gerenciado roda no Neon ou no Supabase em plano gratuito durante o piloto.

## Estrutura

```
minha-saude-feminina/
├── README.md
├── .gitignore
├── frontend/
└── backend/
```

## Identidade visual

A paleta do projeto usa apenas estas cinco cores, nenhuma outra pode aparecer no app:

- #FBF4EB (creme, fundo principal)
- #FBD9E5 (rosa claro, cards e detalhes)
- #C43A4A (vermelho rosado, ação primária)
- #C56682 (rosa queimado, ação secundária)
- #E7A48C (pêssego, acentos)

A tipografia é Leckerli One nos títulos e Gabriel Sans Condensed no corpo.

## Telas previstas

Splash, login, cadastro com configuração do ciclo, tela inicial (Hoje), calendário do ciclo, registro diário de sintomas, conteúdos educativos, chat anônimo "É normal isso?", perfil e perguntas frequentes.

A navegação principal é uma barra inferior com cinco itens: Hoje, Ciclo, botão central de registrar, Conteúdos e Perfil.

## Como rodar

Pré-requisitos: Node.js 18 ou superior, Expo Go instalado no celular para testar o app, e um banco Postgres disponível (conta gratuita em neon.tech ou supabase.com).

Para o backend:

```
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Crie um arquivo `backend/.env` com a string de conexão do Postgres:

```
DATABASE_URL=postgres://usuario:senha@host/banco
```

Para o frontend:

```
cd frontend
npm install
npx expo start
```

Crie um arquivo `frontend/.env` apontando para o backend:

```
EXPO_PUBLIC_API_URL=https://seu-backend.vercel.app
```

Em desenvolvimento local, use o IP da sua máquina (algo como `http://192.168.0.10:3000`) no lugar de `localhost`, senão o celular não consegue acessar.

Os arquivos `.env` não devem ser commitados e já estão no `.gitignore`.

Para testar o app, escaneie o QR Code que aparece no terminal com o Expo Go (Android) ou com a câmera nativa (iOS).

## Geração da APK

Para gerar uma APK distribuível, usamos o EAS Build do Expo:

```
cd frontend
npm install -g eas-cli
eas build --platform android --profile preview
```

O plano gratuito do EAS dá 30 builds por mês, suficiente para a fase de piloto. A APK gerada pode ser baixada do painel do EAS e enviada para os celulares por WhatsApp, e-mail ou pendrive, sem precisar publicar na Play Store ainda.

## Banco de dados

O esquema é gerenciado pelo Prisma e versionado em git. Inclui tabelas para perfis das usuárias, ciclos menstruais, registros diários, artigos de conteúdo e perguntas anônimas. A definição completa fica em `backend/prisma/schema.prisma`.

Cada usuária só enxerga os próprios dados. O controle é feito no backend, validando o token de autenticação antes de qualquer leitura ou escrita.

## Hospedagem

Na fase de piloto tudo roda em plano gratuito:

- Backend Next.js no Vercel
- Postgres no Neon ou Supabase
- APK distribuída diretamente para os celulares dos profissionais de saúde
- HTTPS automático via Vercel

Quando o projeto for para produção em mais UBS, a infraestrutura pode migrar para servidor da UNIFEBE ou outro provedor pago sem precisar reescrever nada, porque é Postgres puro.

## Privacidade

Os dados coletados são considerados dados pessoais sensíveis de saúde pela LGPD. O cadastro pede consentimento explícito, e nada é compartilhado para pesquisas sem que a usuária autorize. O direito de exportar e excluir os dados será implementado antes do lançamento.

Todo conteúdo médico no app exibe o aviso: "Essas informações não substituem avaliação médica. Procure sempre a UBS."

## Status

Em desenvolvimento, fase inicial de estruturação do projeto. O foco atual é o aplicativo mobile.

## Equipe

Curso de Medicina e Curso de Sistemas de Informação da UNIFEBE.
