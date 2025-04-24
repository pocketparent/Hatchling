// scripts/ingest_nuggets.ts
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import nuggets from '../expert_nuggets.json'; // your JSON file at project root

// Initialize Supabase & OpenAI clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ingest() {
  for (const nugget of nuggets) {
    // 1) generate embedding
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: nugget.recommendation
    });
    const [emb] = embeddingRes.data;

    // 2) upsert into Supabase
    const id = `${nugget.source}|${nugget.category}|${nugget.age_range}`;
    await supabase
      .from('expert_nuggets')
      .upsert({
        id,
        source: nugget.source,
        age_range: nugget.age_range,
        category: nugget.category,
        recommendation: nugget.recommendation,
        embedding: emb.embedding
      })
      .eq('id', id);

    console.log(`Upserted ${nugget.category} @ ${nugget.age_range}`);
  }
}

ingest().catch(err => {
  console.error(err);
  process.exit(1);
});
