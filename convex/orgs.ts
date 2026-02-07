import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const planValidator = v.optional(
  v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
);

const settingsValidator = v.optional(
  v.object({
    retentionDays: v.optional(v.number()),
    alertsEnabled: v.optional(v.boolean()),
  }),
);

export const getById = query({
  args: {
    orgId: v.id("orgs"),
  },
  handler: async (ctx, args) => {
    return ctx.db.get(args.orgId);
  },
});

export const getByWorkOSId = query({
  args: {
    workosOrgId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("orgs")
      .withIndex("by_workosOrgId", (q) => q.eq("workosOrgId", args.workosOrgId))
      .first();
  },
});

export const syncFromWorkOS = mutation({
  args: {
    workosOrgId: v.string(),
    name: v.string(),
    plan: planValidator,
    settings: settingsValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existingOrg = await ctx.db
      .query("orgs")
      .withIndex("by_workosOrgId", (q) => q.eq("workosOrgId", args.workosOrgId))
      .first();

    if (existingOrg) {
      await ctx.db.patch(existingOrg._id, {
        name: args.name,
        plan: args.plan,
        settings: args.settings,
        updatedAt: now,
      });
      return existingOrg._id;
    }

    return ctx.db.insert("orgs", {
      workosOrgId: args.workosOrgId,
      name: args.name,
      plan: args.plan ?? "free",
      settings: args.settings,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const listAll = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    return ctx.db.query("orgs").take(limit);
  },
});

export const updateSettings = mutation({
  args: {
    orgId: v.id("orgs"),
    settings: settingsValidator,
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId);
    if (!org) {
      throw new Error("Organization not found");
    }

    await ctx.db.patch(args.orgId, {
      settings: args.settings,
      updatedAt: Date.now(),
    });

    return ctx.db.get(args.orgId);
  },
});

export const updatePlan = mutation({
  args: {
    orgId: v.id("orgs"),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.orgId);
    if (!org) {
      throw new Error("Organization not found");
    }

    await ctx.db.patch(args.orgId, {
      plan: args.plan,
      updatedAt: Date.now(),
    });

    return ctx.db.get(args.orgId);
  },
});

export const getOrgMembers = query({
  args: {
    orgId: v.id("orgs"),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("users")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});
