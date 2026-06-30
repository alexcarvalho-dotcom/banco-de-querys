# Banco de Querys com IA

App interno para cadastrar, consultar e buscar (via IA) querys SQL da empresa.

- Índice alfabético e numerado de todas as querys
- Tela de detalhe com SQL completo escondido por padrão
- Chat em linguagem natural que aponta a query certa do banco (Gemini só explica, nunca inventa SQL)
- Cadastro aberto de novas querys (sem login, sem aprovação)

## Passo a passo: criar as contas e colocar no ar

Você não precisa programar nada — só seguir os passos abaixo na ordem.

### 1. Criar conta no Supabase (banco de dados)

1. Acesse https://supabase.com e clique em "Start your project".
2. Crie a conta (pode usar login com GitHub ou e-mail).
3. Clique em "New project".
   - Escolha um nome, ex: `banco-de-querys`.
   - Crie uma senha de banco de dados (guarde em local seguro, mas não vai precisar dela no dia a dia).
   - Escolha a região mais próxima (ex: South America).
   - Plano: Free.
4. Aguarde o projeto ser criado (1–2 minutos).
5. No menu lateral, clique em **SQL Editor** > **New query**.
6. Abra o arquivo `supabase/schema.sql` deste projeto, copie todo o conteúdo, cole no editor do Supabase e clique em **Run**.
   - Isso cria a tabela `queries` e libera leitura/cadastro público (sem login).
7. No menu lateral, clique em **Project Settings** (ícone de engrenagem) > **API**.
   - Copie o valor de **Project URL** → você vai usar como `NEXT_PUBLIC_SUPABASE_URL`.
   - Copie o valor de **anon public** (chave) → você vai usar como `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 2. Pegar a chave do Gemini

Você já tem a chave da API do Gemini. Guarde-a para o próximo passo (variável `GEMINI_API_KEY`).

### 3. Criar conta no Vercel e publicar o site

1. Acesse https://vercel.com e clique em "Sign Up".
2. Crie a conta usando o mesmo GitHub onde está este repositório (facilita o deploy automático).
3. Clique em **Add New** > **Project**.
4. Selecione o repositório `banco-de-querys` (autorize o Vercel a acessar o GitHub se pedido).
5. Na tela de configuração do projeto, abra **Environment Variables** e adicione as 3 variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL` → cole o Project URL do Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → cole a chave anon public do Supabase.
   - `GEMINI_API_KEY` → cole sua chave do Gemini.
6. Clique em **Deploy**.
7. Aguarde 1–2 minutos. Ao final, o Vercel mostra um link (ex: `banco-de-querys.vercel.app`) — esse é o link interno que você compartilha com a empresa.

### 4. Testar

1. Abra o link gerado pelo Vercel.
2. Vá em **Nova query**, cadastre uma query de teste (título, descrição, SQL).
3. Volte para **Índice** e confira se ela aparece em ordem alfabética.
4. Clique na query, depois em **ver query completa**, para conferir que o SQL aparece certinho.
5. Vá em **Chat com IA**, descreva o que você cadastrou (ex: "preciso da query de teste") e veja se a IA aponta a query certa.

Pronto — o app está no ar, gratuito, sem login, pronto para a empresa usar.

## Rodando localmente (opcional, para quem for mexer no código)

```bash
cp .env.local.example .env.local
# preencha as 3 variáveis no .env.local
npm install
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente

| Variável | Onde pegar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > anon public |
| `GEMINI_API_KEY` | Google AI Studio (sua chave do Gemini) |

`GEMINI_API_KEY` é usada apenas no servidor (rota `/api/chat`) e nunca é exposta ao navegador.
