'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import type { BillingPlan } from './actions';
import { createCheckout } from './actions';

export function CheckoutButton({ plan, label }: { plan: BillingPlan; label?: string }) {
  const [isPending, startTransition] = useTransition();
  const buttonLabel = label ?? 'Atualizar plano';

  return (
    <Button
      type="button"
      onClick={() => {
        startTransition(async () => {
          const result = await createCheckout(plan);
          if (result?.error) {
            alert(result.error);
            return;
          }
          if (result?.url) {
            window.location.href = result.url;
          }
        });
      }}
      disabled={isPending}
    >
      {isPending ? 'Processando...' : buttonLabel}
    </Button>
  );
}
