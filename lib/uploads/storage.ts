import { supabaseServer } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function uploadPdf(userId: string, fileBuffer: Buffer, fileName: string) {
  const supabase = supabaseServer();
  const path = `${userId}/${randomUUID()}-${fileName}`;

  const { error: storageError } = await supabase.storage.from('documents').upload(path, fileBuffer, {
    contentType: 'application/pdf'
  });

  if (storageError) {
    if (storageError.message.includes('does not exist')) {
      throw new Error('Bucket "documents" não encontrado no Supabase. Execute supabase/storage.sql para criá-lo.');
    }
    throw new Error(storageError.message);
  }

  const { error: insertError } = await supabase.from('documents').insert({
    user_id: userId,
    title: fileName,
    storage_path: path,
    status: 'processing'
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return path;
}
