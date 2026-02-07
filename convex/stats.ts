import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Helper function to generate random integer
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random float
function randomFloat(min: number, max: number): number {
  return Number.parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Query to get all stats data
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // Get latest metrics from the database
    const metrics = await ctx.db.query("stats").withIndex("by_type").collect();

    // Get recent project activities
    const projectActivities = await ctx.db
      .query("projectActivities")
      .withIndex("by_timestamp")
      .order("desc")
      .take(100);

    // Get recent activities
    const recentActivities = await ctx.db
      .query("recentActivities")
      .withIndex("by_timestamp")
      .order("desc")
      .take(10);

    // Get project performance data
    const projectPerformance = await ctx.db
      .query("projectPerformance")
      .collect();

    // Get agent activities
    const agentActivities = await ctx.db
      .query("agentActivities")
      .withIndex("by_timestamp")
      .order("desc")
      .take(5);

    // Transform metrics into the expected format
    const metricsMap = {
      activeUsers: randomInt(310, 340),
      ontologyEntities: randomInt(220, 250),
      componentsGenerated: randomInt(1450, 1500),
      aiAgents: randomInt(42, 48),
    };

    // Override with actual values if they exist
    for (const metric of metrics) {
      if (metric.type in metricsMap) {
        metricsMap[metric.type as keyof typeof metricsMap] = metric.value;
      }
    }

    return {
      metrics: metricsMap,
      projects: {
        active: randomInt(10, 15),
        completed: randomInt(30, 38),
        pending: randomInt(6, 10),
        issues: randomInt(2, 5),
      },
      ontology: {
        semanticEntities: randomInt(120, 130),
        kineticEntities: randomInt(62, 72),
        dynamicEntities: randomInt(35, 42),
        relationships: randomInt(205, 225),
      },
      projectActivities,
      recentActivities,
      projectPerformance,
      agentActivities,
    };
  },
});

// Internal mutation to generate new project activity
export const generateProjectActivity = internalMutation({
  args: {},
  handler: async (ctx) => {
    const types = ["development", "testing", "deployment", "planning"];
    const actions = [
      "Code commit",
      "Pull request",
      "Database migration",
      "API implementation",
      "UI component update",
      "CI/CD pipeline run",
      "Schema update",
      "Test case execution",
      "Documentation update",
      "Performance optimization",
    ];
    const projects = [
      "Enterprise CRM",
      "Healthcare Platform",
      "Financial Dashboard",
      "E-commerce System",
      "Government Portal",
      "Logistics Application",
      "Travel Booking Engine",
      "Learning Management System",
    ];

    // Generate random location
    const lat = Math.random() * 140 - 70 + (Math.random() * 10 - 5);
    const lng = Math.random() * 340 - 170 + (Math.random() * 10 - 5);

    const activity = await ctx.db.insert("projectActivities", {
      location: {
        lat: Math.max(-65, Math.min(65, lat)),
        lng,
      },
      type: types[Math.floor(Math.random() * types.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      project: projects[Math.floor(Math.random() * projects.length)],
      importance: Math.random() * 3 + 1,
      timestamp: Date.now(),
    });

    return activity;
  },
});

// Mutation to create recent activity
export const createRecentActivity = mutation({
  args: {
    action: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const activity = await ctx.db.insert("recentActivities", {
      action: args.action,
      type: args.type,
      time: "Just now",
      timestamp: Date.now(),
    });

    return activity;
  },
});

// Internal mutation to initialize demo data
export const initializeDemoData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingData = await ctx.db.query("projectPerformance").first();
    if (existingData) {
      return { message: "Demo data already initialized" };
    }

    // Initialize project performance data
    const projects = [
      {
        name: "Enterprise CRM Portal",
        velocity: randomInt(90, 95),
        qualityScore: randomInt(95, 98),
        budget: "On track",
        budgetStatus: "stable",
        timeline: "Ahead",
        timelineStatus: "positive",
        stakeholderSatisfaction: 4.8,
      },
      {
        name: "Healthcare Analytics Platform",
        velocity: randomInt(85, 90),
        qualityScore: randomInt(92, 96),
        budget: "10% under",
        budgetStatus: "positive",
        timeline: "On track",
        timelineStatus: "stable",
        stakeholderSatisfaction: 4.7,
      },
      {
        name: "Financial Services Dashboard",
        velocity: randomInt(74, 78),
        qualityScore: randomInt(88, 92),
        budget: "5% over",
        budgetStatus: "negative",
        timeline: "Delayed",
        timelineStatus: "negative",
        stakeholderSatisfaction: 4.2,
      },
      {
        name: "E-commerce Marketplace",
        velocity: randomInt(93, 97),
        qualityScore: randomInt(90, 94),
        budget: "On track",
        budgetStatus: "stable",
        timeline: "Ahead",
        timelineStatus: "positive",
        stakeholderSatisfaction: 4.9,
      },
      {
        name: "Government Portal Redesign",
        velocity: randomInt(79, 83),
        qualityScore: randomInt(86, 90),
        budget: "2% under",
        budgetStatus: "positive",
        timeline: "On track",
        timelineStatus: "stable",
        stakeholderSatisfaction: 4.5,
      },
    ];

    for (const project of projects) {
      await ctx.db.insert("projectPerformance", project);
    }

    // Initialize some recent activities
    const recentActivities = [
      {
        action: "New ontology entity added to Financial Schema",
        type: "development",
        time: "2 min ago",
        timestamp: Date.now() - 2 * 60 * 1000,
      },
      {
        action: "Pull request merged for API authentication",
        type: "development",
        time: "5 min ago",
        timestamp: Date.now() - 5 * 60 * 1000,
      },
      {
        action: "Database indexing analysis completed",
        type: "testing",
        time: "12 min ago",
        timestamp: Date.now() - 12 * 60 * 1000,
      },
    ];

    for (const activity of recentActivities) {
      await ctx.db.insert("recentActivities", activity);
    }

    // Initialize some agent activities
    const agentActivities = [
      {
        agent: "Meeting Notes Agent",
        action: "Summarized client meeting",
        project: "HealthTech Portal",
        timestamp: Date.now() - 10 * 60 * 1000,
        status: "completed",
      },
      {
        agent: "Code Assistant",
        action: "Generated API endpoint",
        project: "Financial Dashboard",
        timestamp: Date.now() - 24 * 60 * 1000,
        status: "completed",
      },
      {
        agent: "QA Tester",
        action: "Running regression tests",
        project: "E-commerce Platform",
        timestamp: Date.now() - 60 * 60 * 1000,
        status: "in-progress",
      },
    ];

    for (const activity of agentActivities) {
      await ctx.db.insert("agentActivities", activity);
    }

    return { message: "Demo data initialized successfully" };
  },
});
