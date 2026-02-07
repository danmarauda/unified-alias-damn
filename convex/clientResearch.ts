import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const DEFAULT_RESEARCH_LIMIT = 50;
type ClientResearchDoc = Doc<"clientResearch">;

const TEMP_CLIENT_ID = "temp" as Id<"clientProfiles">;
const TEMP_USER_ID = "temp" as Id<"users">;

// Create a new research draft
export const createResearchDraft = mutation({
  args: {
    clientId: v.id("clientProfiles"),
    title: v.string(),
    summary: v.string(),
    findings: v.string(), // Initial findings, can be empty JSON structure from protocol
    requestedBy: v.id("users"),
    createdBy: v.id("users"),
    assignedAgents: v.array(v.id("users")),
    sourceCount: v.number(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const researchId = await ctx.db.insert("clientResearch", {
      clientId: args.clientId,
      title: args.title,
      summary: args.summary,
      findings: args.findings,
      attachments: [],
      status: "draft",
      requestedBy: args.requestedBy,
      createdBy: args.createdBy,
      assignedAgents: args.assignedAgents,
      qaStatus: "pending", // Default QA status
      sourceCount: args.sourceCount,
      revision: 1,
      tags: args.tags,
      // Convex's _creationTime is used for createdAt
      updatedAt: Date.now(),
    });
    return researchId;
  },
});

// Get research by ID
export const getResearchById = query({
  args: { researchId: v.id("clientResearch") },
  handler: async (ctx, args) => await ctx.db.get(args.researchId),
});

// Get all research for a specific client
export const getResearchForClient = query({
  args: { clientId: v.id("clientProfiles") },
  handler: async (ctx, args) =>
    await ctx.db
      .query("clientResearch")
      .withIndex("by_clientId", (q) => q.eq("clientId", args.clientId))
      .collect(),
});

// Get all research with optional filtering
export const getAllResearch = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("awaiting_approval"),
        v.literal("approved"),
        v.literal("published")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: (ctx, args) => {
    const limit = args.limit ?? DEFAULT_RESEARCH_LIMIT;

    if (args.status) {
      const statusFilter = args.status;
      return ctx.db
        .query("clientResearch")
        .withIndex("by_status", (q) => q.eq("status", statusFilter))
        .take(limit);
    }

    return ctx.db.query("clientResearch").take(limit);
  },
});

// Update research content
export const updateResearchContent = mutation({
  args: {
    researchId: v.id("clientResearch"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    findings: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    sourceCount: v.optional(v.number()),
    updatedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const updateData: Partial<ClientResearchDoc> = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) {
      updateData.title = args.title;
    }
    if (args.summary !== undefined) {
      updateData.summary = args.summary;
    }
    if (args.findings !== undefined) {
      updateData.findings = args.findings;
    }
    if (args.attachments !== undefined) {
      updateData.attachments = args.attachments;
    }
    if (args.tags !== undefined) {
      updateData.tags = args.tags;
    }
    if (args.sourceCount !== undefined) {
      updateData.sourceCount = args.sourceCount;
    }

    await ctx.db.patch(args.researchId, updateData);
    return args.researchId;
  },
});

// Submit research for QA review
export const submitForQA = mutation({
  args: {
    researchId: v.id("clientResearch"),
    reviewDue: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.researchId, {
      status: "awaiting_approval",
      qaStatus: "pending",
      reviewDue: args.reviewDue || Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days default
      updatedAt: Date.now(),
    });
    return args.researchId;
  },
});

// QA review action
export const qaReview = mutation({
  args: {
    researchId: v.id("clientResearch"),
    passed: v.boolean(),
    qaBy: v.id("users"),
    qaNotes: v.optional(v.string()),
    qualityScore: v.optional(v.number()),
    factCheckScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updateData: Partial<ClientResearchDoc> = {
      qaStatus: args.passed ? "passed" : "revisions_requested",
      qaBy: args.qaBy,
      updatedAt: Date.now(),
    };

    if (args.qaNotes !== undefined) {
      updateData.qaNotes = args.qaNotes;
    }
    if (args.qualityScore !== undefined) {
      updateData.qualityScore = args.qualityScore;
    }
    if (args.factCheckScore !== undefined) {
      updateData.factCheckScore = args.factCheckScore;
    }

    await ctx.db.patch(args.researchId, updateData);
    return args.researchId;
  },
});

// Consultant approve research
export const consultantApproveResearch = mutation({
  args: {
    researchId: v.id("clientResearch"),
    approvedBy: v.id("users"),
    approvalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.researchId, {
      status: "approved",
      approvedBy: args.approvedBy,
      approvalNotes: args.approvalNotes,
      approvedAt: Date.now(),
      updatedAt: Date.now(),
    });
    return args.researchId;
  },
});

// Publish research
export const publishResearch = mutation({
  args: {
    researchId: v.id("clientResearch"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.researchId, {
      status: "published",
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });
    return args.researchId;
  },
});

// Simple create research (for ResearchHubClient compatibility)
export const createResearch = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("review"),
      v.literal("approved"),
      v.literal("published")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    // For now, create a simple research entry
    // In production, you'd want to get the actual user IDs
    const researchId = await ctx.db.insert("clientResearch", {
      clientId: TEMP_CLIENT_ID,
      title: args.title,
      summary: args.description,
      findings: JSON.stringify({ category: args.category }),
      attachments: [],
      status: "draft",
      requestedBy: TEMP_USER_ID,
      createdBy: TEMP_USER_ID,
      assignedAgents: [],
      qaStatus: "pending",
      sourceCount: 0,
      revision: 1,
      tags: [args.category],
      updatedAt: Date.now(),
    });
    return researchId;
  },
});

// Delete research
export const deleteResearch = mutation({
  args: {
    id: v.id("clientResearch"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
