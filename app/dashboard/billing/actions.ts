'use server';

import { currentUser } from '@clerk/nextjs/server';
import { createCheckoutSession } from '@/lib/payments/checkout';

export async function createCheckout(plan: 'pro' | 'enterprise') {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }

  const priceId = plan === 'pro' ? process.env.STRIPE_PRICE_ID_PRO : process.env.STRIPE_PRICE_ID_ENTERPRISE;
  if (!priceId) {
    throw new Error('Stripe price ID missing');
  }

  const session = await createCheckoutSession({
    customerEmail: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '',
    priceId,
    metadata: { userId: user.id, plan }
  });

  return { url: session.url };
}