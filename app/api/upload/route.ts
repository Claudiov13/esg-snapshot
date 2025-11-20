import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { validatePdf } from '@/lib/uploads/validator';
import { uploadPdf } from '@/lib/uploads/storage';
import { getUsageLimits } from '@/lib/limits';

async function resolveUserEmail(userId: string, sessionClaims: any) {
  const claimEmail = (sessionClaims?.email as string | undefined)?.toLowerCase();
  if (claimEmail) return claimEmail;
  try {
    const user = await clerkClient.users.getUser(userId);
    const primary = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    return primary?.toLowerCase();
  } catch (error) {
    console.warn('[limits] nao foi possivel ler email do Clerk', error);
    return undefined;
  }
}

export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const email = await resolveUserEmail(userId, sessionClaims);

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo invalido' }, { status: 400 });
  }

  try {
    const limits = await getUsageLimits(userId, email);
    if (limits.remainingDocuments <= 0) {
      return NextResponse.json(
        { error: 'Limite de uploads atingido para seu plano. Atualize o plano ou compre um relatorio avulso.' },
        { status: 403 }
      );
    }

    validatePdf(file);
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadPdf(userId, buffer, file.name);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro ao enviar' }, { status: 500 });
  }
}
