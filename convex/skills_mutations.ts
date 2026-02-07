import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

const NOW = () => Date.now();
type SkillDoc = Doc<"skills">;
type SkillScrapingJobDoc = Doc<"skillScrapingJobs">;

// Skills management mutations
export const createSkill = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    config: v.object({
      sourceUrl: v.string(),
      maxPages: v.optional(v.number()),
      selectors: v.optional(
        v.object({
          content: v.optional(v.string()),
          links: v.optional(v.string()),
          code: v.optional(v.string()),
        })
      ),
      aiEnhancement: v.optional(v.boolean()),
      includeCode: v.optional(v.boolean()),
    }),
    createdBy: v.optional(v.id("users")),
  },
  returns: v.object({ skillId: v.id("skills") }),
  handler: async (ctx, args) => {
    const now = NOW();
    const skillId = await ctx.db.insert("skills", {
      name: args.name,
      description: args.description,
      version: "1.0.0",
      category: args.category,
      tags: args.tags,
      config: args.config,
      status: "draft",
      isActive: true,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });

    return { skillId };
  },
});

export const updateSkill = mutation({
  args: {
    id: v.id("skills"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    config: v.optional(
      v.object({
        sourceUrl: v.string(),
        maxPages: v.optional(v.number()),
        selectors: v.optional(
          v.object({
            content: v.optional(v.string()),
            links: v.optional(v.string()),
            code: v.optional(v.string()),
          })
        ),
        aiEnhancement: v.optional(v.boolean()),
        includeCode: v.optional(v.boolean()),
      })
    ),
    isActive: v.optional(v.boolean()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const updateData: Partial<SkillDoc> = { updatedAt: NOW() };

    if (args.name !== undefined) {
      updateData.name = args.name;
    }
    if (args.description !== undefined) {
      updateData.description = args.description;
    }
    if (args.category !== undefined) {
      updateData.category = args.category;
    }
    if (args.tags !== undefined) {
      updateData.tags = args.tags;
    }
    if (args.config !== undefined) {
      updateData.config = args.config;
    }
    if (args.isActive !== undefined) {
      updateData.isActive = args.isActive;
    }

    await ctx.db.patch(args.id, updateData);
    return { success: true };
  },
});

export const deleteSkill = mutation({
  args: { id: v.id("skills") },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const startScrapingJob = mutation({
  args: {
    skillId: v.id("skills"),
  },
  returns: v.object({ jobId: v.id("skillScrapingJobs") }),
  handler: async (ctx, args) => {
    const skill = await ctx.db.get(args.skillId);
    if (!skill) {
      throw new Error("Skill not found");
    }

    // Create scraping job
    const jobId = await ctx.db.insert("skillScrapingJobs", {
      skillId: args.skillId,
      status: "pending",
      config: skill.config,
      progress: {
        currentPage: 0,
        totalPages: 0,
        percentage: 0,
      },
      startedAt: NOW(),
    });

    // Update skill status
    await ctx.db.patch(args.skillId, {
      status: "scraping",
      updatedAt: NOW(),
    });

    // Schedule the scraping job (would be handled by a worker in production)
    // Note: internal.skills doesn't exist yet, using a placeholder implementation

    return { jobId };
  },
});

export const createSkillVersion = mutation({
  args: {
    skillId: v.id("skills"),
    version: v.string(),
    changelog: v.string(),
    downloadUrl: v.string(),
    fileSize: v.number(),
    pageCount: v.number(),
    createdBy: v.optional(v.id("users")),
  },
  returns: v.object({ versionId: v.id("skillVersions") }),
  handler: async (ctx, args) => {
    const versionId = await ctx.db.insert("skillVersions", {
      skillId: args.skillId,
      version: args.version,
      changelog: args.changelog,
      config: { sourceUrl: "", maxPages: 10 }, // Minimal config
      downloadUrl: args.downloadUrl,
      createdAt: NOW(),
      createdBy: args.createdBy,
      fileSize: args.fileSize,
      pageCount: args.pageCount,
    });

    return { versionId };
  },
});

export const updateSkillStatus = mutation({
  args: {
    skillId: v.id("skills"),
    status: v.union(
      v.literal("draft"),
      v.literal("scraping"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("error")
    ),
    metadata: v.optional(
      v.object({
        pageCount: v.optional(v.number()),
        fileSize: v.optional(v.number()),
        lastScraped: v.optional(v.number()),
        errorMessage: v.optional(v.string()),
      })
    ),
    downloadUrl: v.optional(v.string()),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const updateData: Partial<SkillDoc> = {
      status: args.status,
      updatedAt: NOW(),
    };

    if (args.metadata !== undefined) {
      updateData.metadata = args.metadata;
    }
    if (args.downloadUrl !== undefined) {
      updateData.downloadUrl = args.downloadUrl;
    }

    await ctx.db.patch(args.skillId, updateData);
    return { success: true };
  },
});

export const updateScrapingJobProgress = mutation({
  args: {
    jobId: v.id("skillScrapingJobs"),
    progress: v.object({
      currentPage: v.number(),
      totalPages: v.number(),
      percentage: v.number(),
    }),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    results: v.optional(
      v.object({
        pagesScraped: v.number(),
        filesGenerated: v.number(),
        downloadUrl: v.optional(v.string()),
        errorMessage: v.optional(v.string()),
      })
    ),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args) => {
    const updateData: Partial<SkillScrapingJobDoc> = {
      progress: args.progress,
      status: args.status,
    };

    if (args.results !== undefined) {
      updateData.results = args.results;
    }
    if (args.status === "completed" || args.status === "failed") {
      updateData.completedAt = NOW();
    }

    await ctx.db.patch(args.jobId, updateData);
    return { success: true };
  },
});
