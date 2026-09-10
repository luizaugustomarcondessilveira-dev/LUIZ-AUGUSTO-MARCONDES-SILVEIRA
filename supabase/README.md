# Migrações Supabase - Rotinas da Família

Este diretório contém a estrutura de banco de dados PostgreSQL e as migrações para o aplicativo **Rotinas da Família**.

## Arquivo de Migração
- `migrations/20260908000000_create_rotinas_da_familia_schema.sql`

## Como Aplicar as Migrações no Supabase

### Opção 1: Via Painel do Supabase (SQL Editor) - Mais Rápido
1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New query**.
4. Copie todo o conteúdo do arquivo `supabase/migrations/20260908000000_create_rotinas_da_familia_schema.sql` e cole no editor.
5. Clique em **Run** (Executar).
6. Todas as tabelas, índices, políticas de segurança RLS e dados iniciais serão criados automaticamente.

### Opção 2: Via Supabase CLI
Se você utiliza a CLI do Supabase localmente:
```bash
# Vincular ao seu projeto Supabase
supabase link --project-ref seu-project-ref

# Aplicar as migrações
supabase db push
```

## Variáveis de Ambiente no AI Studio
Configure as seguintes variáveis no menu **Settings** ou arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anon
```
Assim que essas variáveis estiverem preenchidas, o aplicativo se conectará automaticamente ao Supabase em tempo real!
