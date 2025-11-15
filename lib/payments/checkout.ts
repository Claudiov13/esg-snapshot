import { stripe } from '@/lib/stripe';
import { siteConfig } from '@/lib/config/site';

type Params = {
  customerEmail: string;
  priceId: string;
  metadata?: Record<string, string>;
  successPath?: string;
  cancelPath?: string;
};

export async function createCheckoutSession({ customerEmail, priceId, metadata = {}, successPath = '/dashboard', cancelPath = '/dashboard/billing' }: Params) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: customerEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteConfig.url}${successPath}`,
    cancel_url: `${siteConfig.url}${cancelPath}`,
    metadata
  });
}
