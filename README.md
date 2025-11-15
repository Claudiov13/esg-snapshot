# ESG Snapshot SaaS

Stack completo em Next.js 14 (App Router) com Clerk, Supabase, Stripe, upload de PDFs e dashboards para clientes e administradores.

## Recursos principais

- **Autenticação** com Clerk, middleware protegido e rotas públicas/privadas.
- **Banco** via Supabase/Postgres com tabelas `profiles`, `documents` e `subscriptions` espelhadas no `schema.prisma`.
- **Uploads de PDF** com validação via Zod, storage no bucket `documents` e registro em tabela.
- **Billing** com Stripe (checkout session + webhook) e botão integrado ao dashboard.
- **Dashboard do cliente** com cards, listagem de documentos e formulário de upload.
- **Admin** com tabela de usuários/assinaturas e API protegida.
- **Landing/Marketing** pages (`/`, `/pricing`, `/contact`) com layout dedicado.

## Scripts

```bash
pnpm dev # ou npm/yarn
yarn build # gera produção
npm run typecheck # garante tipos válidos
```

## Variáveis de ambiente

Copie `.env.example` e preencha dados de Clerk, Supabase e Stripe.

## Supabase

- Execute `supabase db push` para aplicar `supabase/schema.sql`.
- Configure bucket `documents` conforme `supabase/storage.sql`.

## Stripe

- Configure preços e coloque IDs em `STRIPE_PRICE_ID_PRO` e `STRIPE_PRICE_ID_ENTERPRISE`.
- Defina webhook para `/api/stripe/webhook`.

## Próximos passos

1. Instale dependências (`pnpm install`).
2. Configure providers.
3. Ajuste estilos/componentes conforme identidade visual final.
