import { z } from 'zod';

const MB = 1024 * 1024;
const MAX_PDF_SIZE = Number(process.env.MAX_PDF_SIZE_MB ?? 10) * MB;

const pdfSchema = z.object({
  type: z.literal('application/pdf'),
  size: z.number().max(MAX_PDF_SIZE, `Arquivo deve ter até ${MAX_PDF_SIZE / MB}MB`)
});

export function validatePdf(file: File | Blob) {
  pdfSchema.parse({ type: file.type, size: file.size });
}
