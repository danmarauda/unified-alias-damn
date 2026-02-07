import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const DEMO_ACTIVITY_ITERATIONS = 50;

// Run this mutation to initialize demo data
export const setupDemoData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Initialize demo data for all collections
    const results = await Promise.all([
      ctx.runMutation(internal.stats.initializeDemoData),
      ctx.runMutation(internal.agentMetrics.generateDemoAgentCalls),
    ]);

    // Generate some initial project activities
    for (let i = 0; i < DEMO_ACTIVITY_ITERATIONS; i += 1) {
      await ctx.runMutation(internal.stats.generateProjectActivity);
    }

    return { success: true, message: "Demo data initialized" };
  },
});
