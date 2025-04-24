// lib/retrieval.ts
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Supabase & OpenAI clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Retrieve the top-K expert nuggets most similar to the queryText
 */
export async function getExpertContext(queryText: string, k = 5) {
  // 1) create embedding for the query
  const embeddingRes = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: queryText
  });
  const [queryEmb] = embeddingRes.data;

  // 2) call the SQL function to match on pgvector
  const { data, error } = await supabase
    .rpc('match_expert_nuggets', {
      query_embedding: queryEmb.embedding,
      match_count: k
    });

  if (error) throw error;
  return data as Array<{
    source: string;
    age_range: string;
    category: string;
    recommendation: string;
  }>;
}
