import { serve } from 'https://deno.land/x/sift/mod.ts';
import { askQuestion, getSmartSleepSchedule, getInsightReport } from '../lib/your-modules.ts';

serve({
  '/ask': async ({ json }) => {
    const { babyContext, question } = await json();
    const answer = await askQuestion(babyContext, question);
    return new Response(JSON.stringify({ answer }), { status: 200 });
  },
  '/schedule': async ({ json }) => {
    const { babyProfile, todayActivities } = await json();
    const plan = await getSmartSleepSchedule(babyProfile, todayActivities);
    return new Response(JSON.stringify(plan), { status: 200 });
  },
  '/insights': async ({ json }) => {
    const { babyProfile, history } = await json();
    const report = await getInsightReport(babyProfile, history);
    return new Response(JSON.stringify({ report }), { status: 200 });
  }
});
