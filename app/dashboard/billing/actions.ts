'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createCheckoutSession } from '@/lib/payments/checkout';
import { stripe } from '@/lib/stripe';

export type BillingPlan = 'pro' | 'avulso';

const planConfig: Record<BillingPlan, { priceId?: string; mode: 'subscription' | 'payment' }> = {
  pro: {
    priceId: process.env.STRIPE_PRICE_ID_PRO,
    mode: 'subscription'
  },
  avulso: {
    priceId: process.env.STRIPE_PRICE_ID_AVULSO,
    mode: 'payment'
  }
};

async function resolvePriceId(rawId: string) {
  if (rawId.startsWith('price_')) {
    return rawId;
  }
  if (!rawId.startsWith('prod_')) {
    throw new Error('ID do Stripe deve ser um price_ ou prod_.');
  }

  // Product ID informado: tenta pegar o default_price ou o primeiro preço ativo.
  const product = await stripe.products.retrieve(rawId, { expand: ['default_price'] });
  if (typeof product.default_price === 'string') {
    return product.default_price;
  }
  if (product.default_price && 'id' in product.default_price) {
    return product.default_price.id;
  }

  const prices = await stripe.prices.list({ product: rawId, active: true, limit: 1 });
  const priceId = prices.data[0]?.id;
  if (!priceId) {
    throw new Error('Nenhum preco ativo encontrado para este produto.');
  }
  return priceId;
}

export async function createCheckout(plan: BillingPlan) {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const config = planConfig[plan];
  try {
    if (!config?.priceId) {
      return { error: `Configure o ID do Stripe para o plano ${plan}.` };
    }

    const priceId = await resolvePriceId(config.priceId);

    const session = await createCheckoutSession({
      customerEmail: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '',
      priceId,
      mode: config.mode,
      metadata: { userId: user.id, plan }
    });

    return { url: session.url };
  } catch (error) {
    console.error('[billing] erro ao criar checkout', error);
    return { error: 'Nao foi possivel iniciar o checkout no Stripe.' };
  }
}
