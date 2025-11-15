import { supabaseServer } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function uploadPdf(userId: string, fileBuffer: Buffer, fileName: string) {
  const supabase = supabaseServer();
  const path = `${userId}/${randomUUID()}-${fileName}`;

  const { error: storageError } = await supabase.storage.from('documents').upload(path, fileBuffer, {
    contentType: 'application/pdf'
  });

  if (storageError) {
    throw storageError;
  }

  const { error: insertError } = await supabase.from('documents').insert({
    user_id: userId,
    title: fileName,
    storage_path: path,
    status: 'processing'
  });

  if (insertError) {
    throw insertError;
  }

  return path;
}
