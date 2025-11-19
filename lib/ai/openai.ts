import OpenAI from 'openai';

let client: OpenAI | null = null;

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set. Add it to your environment to enable ESG report generation.');
  }

  if (!client) {
    client = new OpenAI({ apiKey });
  }

  return client;
}
