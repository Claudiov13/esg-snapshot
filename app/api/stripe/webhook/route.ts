import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyStripeSignature } from '@/lib/payments/webhooks';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = Buffer.from(await request.arrayBuffer());
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 });
  }

  try {
    const event = verifyStripeSignature(body, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      if (session.subscription && session.metadata?.userId) {
        await supabaseServer().from('subscriptions').upsert({
          id: session.subscription as string,
          user_id: session.metadata.userId as string,
          status: session.status ?? 'active',
          plan: session.metadata.plan ?? 'pro'
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid signature' }, { status: 400 });
  }
}