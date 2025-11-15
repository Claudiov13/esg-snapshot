import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { validatePdf } from '@/lib/uploads/validator';
import { uploadPdf } from '@/lib/uploads/storage';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
  }

  try {
    validatePdf(file);
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadPdf(userId, buffer, file.name);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao enviar' }, { status: 500 });
  }
}
