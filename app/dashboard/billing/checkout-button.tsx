'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { createCheckout } from './actions';

export function CheckoutButton({ plan }: { plan: 'pro' | 'enterprise' }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      onClick={() => {
        startTransition(async () => {
          const result = await createCheckout(plan);
          if (result.url) {
            window.location.href = result.url;
          }
        });
      }}
      disabled={isPending}
    >
      {isPending ? 'Processando...' : 'Atualizar plano'}
    </Button>
  );
}