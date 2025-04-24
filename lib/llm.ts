// lib/llm.ts
import OpenAI from 'openai';
import { getExpertContext } from './retrieval';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * General Q&A
 */
export async function askQuestion(
  babyContext: string,
  question: string
): Promise<string> {
  const nuggets = await getExpertContext(question);
  const systemPrompt = `
You are a caring pediatric assistant. Here are some expert sleep & care nuggets:
${nuggets.map(n =>
    `- (${n.category}, ${n.age_range}): ${n.recommendation.trim()}`
  ).join('\n')}
`;
  const messages = [
    { role: 'system' , content: systemPrompt },
    { role: 'user'   , content: `${babyContext}\n\nQuestion: ${question}` }
  ];
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages
  });
  return res.choices[0].message.content;
}

/**
 * Smart Sleep Schedule & Nudges
 */
export async function getSmartSleepSchedule(
  babyProfile: any,
  todayActivities: any[]
): Promise<{ wakeTime: string; naps: { start: string; end: string; }[]; bedtime: string; }> {
  const contextText = `
Baby Profile: ${JSON.stringify(babyProfile)}
Today's activities: ${JSON.stringify(todayActivities)}
`;
  const nuggets = await getExpertContext(contextText);
  const systemPrompt = `
You are a baby-sleep coach. Given these expert rules:
${nuggets.map(n => `- ${n.recommendation.trim()}`).join('\n')}
And given the baby data above, suggest:
1) Today's nap and bedtime schedule.
2) If any deviations occur, how to adjust downstream slots.
Respond in JSON with fields { wakeTime, naps: [{start,end}], bedtime }.
`;
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user'  , content: 'Generate today\'s plan.' }
  ];
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages
  });
  return JSON.parse(res.choices[0].message.content);
}

/**
 * AI Insight Reports (e.g., weekly/monthly)
 */
export async function getInsightReport(
  babyProfile: any,
  history: any[]
): Promise<string> {
  const nuggets = await getExpertContext(`Insights for ${babyProfile.name}`);
  const systemPrompt = `
You are a baby-care analyst. Using these expert guidelines:
${nuggets.map(n => `- ${n.recommendation.trim()}`).join('\n')}
And the baby's activity history (past week):
${JSON.stringify(history)}
Please generate:
1) Sleep trends & suggestions.
2) Feeding trends & tips.
3) Diaper insights.
Respond in a friendly, bulleted report.
`;
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user'  , content: 'Generate a weekly insight report.' }
  ];
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages
  });
  return res.choices[0].message.content;
}
