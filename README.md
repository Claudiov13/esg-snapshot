# ESG Snapshot SaaS

Stack completo em Next.js 14 (App Router) com Clerk, Supabase, Stripe, upload de PDFs, geração de relatórios ESG via OpenAI e dashboards multi-usuário.

## Recursos principais

- **Autenticação** com Clerk e middleware protegido.
- **Banco** via Supabase/Postgres com tabelas `profiles`, `documents`, `subscriptions`, `esg_reports` e `esg_report_documents` (RLS habilitado).
- **Uploads de PDF** com validação via Zod e storage dedicado.
- **Billing** com Stripe (checkout + webhook) e botão integrado ao dashboard.
- **Dashboard** com cards de documentos, CTA para relatórios, saúde ESG e feed de atividades.
- **Relatórios ESG** com formulário guiado por perguntas, vínculo de PDFs e geração com IA (OpenAI GPT-4o-mini) exibindo resumo, ODS, GRI, matriz de risco, plano de ação, KPIs e pontuação visual.
- **Admin** com tabela de usuários e API protegida.
- **Landing/Marketing** pages (`/`, `/pricing`, `/contact`).

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run typecheck
```

## Variáveis de ambiente

Copie `.env.example` e preencha:

- Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
- Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_*`).
- OpenAI (`OPENAI_API_KEY`) para `/api/generate-report`.

## Supabase

1. Execute `supabase db push` para aplicar `supabase/schema.sql` (inclui `esg_reports` + `esg_report_documents` + colunas de score/inputs).
2. Configure o bucket `documents` conforme `supabase/storage.sql`.
3. Opcional: rode `supabase/seed.sql` para usuários de teste.

## Fluxo ESG com IA

1. O usuário envia PDFs em **Documentos** (status e vínculos aparecem na tabela).
2. Em **Relatórios ESG → Novo relatório**, responde o questionário (metas, cadeia de fornecedores, risco, etc.) e seleciona PDFs.
3. O formulário chama `/api/generate-report`, que valida o usuário, monta o prompt, consulta a OpenAI e grava o relatório em `esg_reports` (incluindo `scoreboard`, `inputs` e `supplier_summary`).
4. O dashboard mostra contagem e “Saúde ESG” baseada nos últimos relatórios; a página de detalhe exibe resumo, seções estruturadas, gráficos em barras e documentos relacionados.

## Stripe

- Configure preços e coloque IDs em `STRIPE_PRICE_ID_PRO` e `STRIPE_PRICE_ID_ENTERPRISE`.
- Defina seu webhook apontando para `/api/stripe/webhook`.

## Deploy

1. Instale dependências (`npm install`).
2. Configure todas as variáveis na Vercel.
3. Certifique-se de executar `npm run lint && npm run build` antes do deploy.
