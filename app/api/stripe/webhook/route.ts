import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyStripeSignature } from '@/lib/payments/webhooks';
import { supabaseServer } from '@/lib/supabase/server';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = Buffer.from(await request.arrayBuffer());
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 });
  }

  try {
    const event = verifyStripeSignature(body, signature);
    const supabase = supabaseServer();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = (session.metadata?.plan as string | undefined) ?? 'pro';

      if (!userId) {
        console.warn('[stripe] session without userId metadata');
      } else {
        const isSubscription = session.mode === 'subscription' && !!session.subscription;
        const recordId = (isSubscription ? session.subscription : session.payment_intent) ?? session.id;

        await supabase.from('subscriptions').upsert({
          id: recordId as string,
          user_id: userId as string,
          status: isSubscription ? session.status ?? 'active' : session.payment_status ?? 'paid',
          plan
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid signature' }, { status: 400 });
  }
}
