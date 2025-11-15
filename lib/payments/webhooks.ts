import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

export function verifyStripeSignature(payload: Buffer, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is missing');
  }
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

export type StripeSubscriptionPayload = Stripe.Checkout.Session & { metadata: { userId: string } };
