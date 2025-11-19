'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

export function PdfUploadForm() {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;
    if (!fileInput.files?.length) {
      setStatus('Selecione um PDF');
      return;
    }

    const data = new FormData();
    data.append('file', fileInput.files[0]);

    try {
      setIsLoading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? 'Erro ao enviar');
      }
      setStatus('Upload realizado!');
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Erro ao enviar');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="file" accept="application/pdf" name="file" />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar PDF'}
      </Button>
      {status && <small style={{ color: 'var(--gray-500)' }}>{status}</small>}
    </form>
  );
}
