import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createCheckoutSession } from '@/lib/payments/checkout';

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { priceId } = await request.json();
  if (!priceId) {
    return NextResponse.json({ error: 'priceId required' }, { status: 400 });
  }

  const session = await createCheckoutSession({
    customerEmail: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? '',
    priceId,
    metadata: { userId: user.id }
  });

  return NextResponse.json({ url: session.url });
}