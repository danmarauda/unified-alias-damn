import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const DEFAULT_CLIENT_LIMIT = 50;
type ClientProfileDoc = Doc<"clientProfiles">;

// Create a new client profile
export const createClientProfile = mutation({
  args: {
    name: v.string(),
    industry: v.string(),
    size: v.string(), // "small", "medium", "large", "enterprise"
    location: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("prospect"),
      v.literal("inactive")
    ),
    tags: v.array(v.string()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const clientId = await ctx.db.insert("clientProfiles", {
      name: args.name,
      industry: args.industry,
      size: args.size,
      location: args.location,
      description: args.description,
      website: args.website,
      status: args.status,
      tags: args.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return clientId;
  },
});

// Get all client profiles with optional filtering
export const getAllClients = query({
  args: {
    status: v.optional(
      v.union(v.literal("active"), v.literal("prospect"), v.literal("inactive"))
    ),
    industry: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: (ctx, args) => {
    const limit = args.limit ?? DEFAULT_CLIENT_LIMIT;

    if (args.search) {
      const searchTerm = args.search;
      return ctx.db
        .query("clientProfiles")
        .withSearchIndex("search_name", (q) => q.search("name", searchTerm))
        .take(limit);
    }

    if (args.status) {
      const statusFilter = args.status;
      return ctx.db
        .query("clientProfiles")
        .withIndex("by_status", (q) => q.eq("status", statusFilter))
        .take(limit);
    }

    return ctx.db.query("clientProfiles").take(limit);
  },
});

// Get client by ID
export const getClientById = query({
  args: { clientId: v.id("clientProfiles") },
  handler: async (ctx, args) => await ctx.db.get(args.clientId),
});

// Update client profile
export const updateClientProfile = mutation({
  args: {
    clientId: v.id("clientProfiles"),
    name: v.optional(v.string()),
    industry: v.optional(v.string()),
    size: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("active"), v.literal("prospect"), v.literal("inactive"))
    ),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const updateData: Partial<ClientProfileDoc> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) {
      updateData.name = args.name;
    }
    if (args.industry !== undefined) {
      updateData.industry = args.industry;
    }
    if (args.size !== undefined) {
      updateData.size = args.size;
    }
    if (args.location !== undefined) {
      updateData.location = args.location;
    }
    if (args.description !== undefined) {
      updateData.description = args.description;
    }
    if (args.website !== undefined) {
      updateData.website = args.website;
    }
    if (args.status !== undefined) {
      updateData.status = args.status;
    }
    if (args.tags !== undefined) {
      updateData.tags = args.tags;
    }

    await ctx.db.patch(args.clientId, updateData);
    return args.clientId;
  },
});

// Get client statistics
export const getClientStats = query({
  args: {},
  handler: async (ctx) => {
    const allClients = await ctx.db.query("clientProfiles").collect();

    const stats = {
      total: allClients.length,
      active: allClients.filter((c) => c.status === "active").length,
      prospects: allClients.filter((c) => c.status === "prospect").length,
      inactive: allClients.filter((c) => c.status === "inactive").length,
      byIndustry: {} as Record<string, number>,
      bySize: {} as Record<string, number>,
    };

    for (const client of allClients) {
      stats.byIndustry[client.industry] =
        (stats.byIndustry[client.industry] || 0) + 1;
      stats.bySize[client.size] = (stats.bySize[client.size] || 0) + 1;
    }

    return stats;
  },
});
