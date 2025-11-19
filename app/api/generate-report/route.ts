import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { getOpenAIClient } from '@/lib/ai/openai';
import { supabaseServer } from '@/lib/supabase/server';

const questionnaireSchema = z.object({
  esgGoals: z.string().min(2),
  supplyChainProfile: z.string().min(2),
  stakeholderConcerns: z.string().min(2),
  partnerRegions: z.string().min(1),
  riskTolerance: z.enum(['Baixa', 'Média', 'Alta']),
  dataReliability: z.enum(['Limitada', 'Parcial', 'Completa']),
  supplierEngagement: z.enum(['Inicial', 'Em desenvolvimento', 'Estruturado']),
  supplierNotes: z.string().optional().or(z.literal(''))
});

const formSchema = z.object({
  companyName: z.string().min(2),
  industry: z.string().min(2),
  companySize: z.string().min(1),
  region: z.string().min(1),
  maturity: z.string().min(1),
  themes: z.string().min(1),
  website: z.string().url().optional().or(z.literal('')),
  questionnaire: questionnaireSchema,
  documentIds: z.array(z.string()).optional().default([])
});

const OUTPUT_HINT = `Return a JSON object with the following shape:
{
  "executive_summary": string,
  "ods": [{ "goal": string, "reason": string }],
  "gri_topics": [{ "topic": string, "explanation": string }],
  "risk_matrix": [{ "risk": string, "probability": "low|medium|high", "impact": "low|medium|high", "priority": "low|medium|high", "mitigation": string }],
  "action_plan": [{ "horizon": "short-term|mid-term", "actions": string }],
  "kpis": [{ "name": string, "description": string }],
  "scoreboard": { "environment": number, "social": number, "governance": number },
  "supplier_summary": string
}`;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const result = formSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
  }

  const payload = result.data;
  let supabase;
  try {
    supabase = supabaseServer();
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Supabase configuration error.' }, { status: 500 });
  }

  const documentsSummary: string[] = [];
  if (payload.documentIds?.length) {
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('id, title, status')
      .eq('user_id', userId)
      .in('id', payload.documentIds);

    if (docsError) {
      return NextResponse.json({ error: docsError.message }, { status: 500 });
    }

    docs?.forEach((doc) => {
      documentsSummary.push(`- ${doc.title} (status: ${doc.status})`);
    });
  }

  const questionnaireText = `
- ESG goals: ${payload.questionnaire.esgGoals}
- Supply chain profile: ${payload.questionnaire.supplyChainProfile}
- Stakeholder concerns: ${payload.questionnaire.stakeholderConcerns}
- Critical partners/regions: ${payload.questionnaire.partnerRegions}
- Risk tolerance: ${payload.questionnaire.riskTolerance}
- Supplier engagement: ${payload.questionnaire.supplierEngagement}
- Data reliability: ${payload.questionnaire.dataReliability}
- Extra supplier notes: ${payload.questionnaire.supplierNotes || 'N/A'}
`;

  const prompt = `Você é um consultor ESG experiente. Crie um relatório ESG conciso e consistente para a empresa ou fornecedor descrito abaixo.

Company data:
- Name: ${payload.companyName}
- Industry: ${payload.industry}
- Size: ${payload.companySize}
- Region: ${payload.region}
- ESG maturity: ${payload.maturity}
- Themes of focus: ${payload.themes}
- Website: ${payload.website || 'N/A'}

Questionnaire insights:
${questionnaireText}

Uploaded documents:
${documentsSummary.length ? documentsSummary.join('\n') : 'No supporting documents were provided yet.'}

${OUTPUT_HINT}
A resposta deve ser um JSON válido apenas, sem texto adicional.`;

  let reportContent: any;
  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are an ESG strategy expert that creates pragmatic reports for sustainability teams.' },
        { role: 'user', content: prompt }
      ]
    });

    const message = completion.choices[0]?.message?.content ?? '';
    const cleaned = message.replace(/```json/gi, '').replace(/```/g, '').trim();
    reportContent = JSON.parse(cleaned);
  } catch (error) {
    console.error('OpenAI error', error);
    return NextResponse.json({ error: 'Failed to generate report with AI. Check OPENAI_API_KEY and usage limits.' }, { status: 500 });
  }

  const inputsPayload = {
    company: {
      companyName: payload.companyName,
      industry: payload.industry,
      companySize: payload.companySize,
      region: payload.region,
      maturity: payload.maturity,
      themes: payload.themes,
      website: payload.website
    },
    questionnaire: payload.questionnaire,
    documents: payload.documentIds
  };

  const { data: report, error: insertError } = await supabase
    .from('esg_reports')
    .insert({
      user_id: userId,
      company_name: payload.companyName,
      industry: payload.industry,
      company_size: payload.companySize,
      region: payload.region,
      maturity: payload.maturity,
      themes: payload.themes,
      website: payload.website || null,
      executive_summary: reportContent?.executive_summary ?? '',
      ods: reportContent?.ods ?? [],
      gri_topics: reportContent?.gri_topics ?? [],
      risk_matrix: reportContent?.risk_matrix ?? [],
      action_plan: reportContent?.action_plan ?? [],
      kpis: reportContent?.kpis ?? [],
      score: reportContent?.scoreboard ?? {},
      inputs: inputsPayload,
      supplier_summary: reportContent?.supplier_summary ?? '',
      status: 'generated'
    })
    .select('*')
    .single();

  if (insertError || !report) {
    const message = insertError?.code === '42P01'
      ? 'Tabela esg_reports não encontrada. Execute supabase/schema.sql nas suas instâncias.'
      : insertError?.message ?? 'Unable to save report';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (payload.documentIds?.length) {
    const linkRows = payload.documentIds.map((id: string) => ({ report_id: report.id, document_id: id }));
    await supabase.from('esg_report_documents').insert(linkRows);
  }

  return NextResponse.json({ report });
}
