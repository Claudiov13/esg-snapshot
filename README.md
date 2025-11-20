# ESG Snapshot SaaS

Stack completo em Next.js 14 (App Router) com Clerk, Supabase, Stripe, upload de PDFs para contexto e geracao de relatorios ESG via OpenAI.

## Recursos principais

- Autenticacao com Clerk e middleware protegido.
- Banco em Supabase/Postgres com tabelas `profiles`, `documents`, `subscriptions`, `esg_reports` e `esg_report_documents` (RLS habilitado).
- Uploads de PDF com validacao via Zod e storage dedicado.
- Billing com Stripe (checkout + webhook) e botao integrado ao dashboard.
- Dashboard com cards de documentos, CTA para relatorios, saude ESG e feed de atividades.
- Relatorios ESG com formulario guiado, vinculo de PDFs e geracao com IA (OpenAI GPT-4o-mini) com resumo, ODS, GRI, matriz de risco, plano de acao, KPIs e score visual.
- Admin com tabela de usuarios e API protegida.
- Paginas de marketing (`/`, `/pricing`, `/contact`).

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run typecheck
```

## Variaveis de ambiente

Copie `.env.example` e preencha:

- Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
- Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`, `STRIPE_PRICE_ID_AVULSO`).
- OpenAI (`OPENAI_API_KEY`) para `/api/generate-report`.

## Supabase

1. Execute `supabase db push` para aplicar `supabase/schema.sql` (inclui `esg_reports`, `esg_report_documents` e colunas de score/inputs).
2. Configure o bucket `documents` conforme `supabase/storage.sql`.
3. Opcional: rode `supabase/seed.sql` para usuarios de teste.

## Fluxo ESG com IA

1. O usuario envia PDFs em **Documentos** (status e vinculos aparecem na tabela).
2. Em **Relatorios ESG -> Novo relatorio**, responde o questionario (metas, cadeia de fornecedores, risco etc.) e seleciona PDFs.
3. O formulario chama `/api/generate-report`, que valida o usuario, monta o prompt, consulta a OpenAI e grava o relatorio em `esg_reports` (incluindo `scoreboard`, `inputs` e `supplier_summary`).
4. O dashboard mostra contagem e "Saude ESG" baseada nos ultimos relatorios; a pagina de detalhe exibe resumo, secoes estruturadas, graficos e documentos relacionados.

## Stripe

- Crie dois precos: assinatura mensal (R$250, ate 5 relatorios + 5 uploads) e relatorio avulso (R$99).
- Preencha `STRIPE_PRICE_ID_PRO` e `STRIPE_PRICE_ID_AVULSO` com IDs de preco do Stripe iniciando com `price_`.
- Defina seu webhook apontando para `/api/stripe/webhook`.

## Deploy

1. Instale dependencias (`npm install`).
2. Configure todas as variaveis na Vercel.
3. Rode `npm run lint && npm run build` antes do deploy.
