import { stripe } from '@/lib/stripe';
import { siteConfig } from '@/lib/config/site';

type Params = {
  customerEmail: string;
  priceId: string;
  mode: 'subscription' | 'payment';
  paymentMethodTypes?: ('card' | 'boleto' | 'pix')[];
  metadata?: Record<string, string>;
  successPath?: string;
  cancelPath?: string;
};

export async function createCheckoutSession({
  customerEmail,
  priceId,
  mode,
  paymentMethodTypes = ['card'],
  metadata = {},
  successPath = '/dashboard',
  cancelPath = '/dashboard/billing'
}: Params) {
  return stripe.checkout.sessions.create({
    mode,
    customer_email: customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: paymentMethodTypes,
    success_url: `${siteConfig.url}${successPath}`,
    cancel_url: `${siteConfig.url}${cancelPath}`,
    metadata
  });
}
