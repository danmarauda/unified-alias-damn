import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

// Skills management queries
export const listSkills = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("scraping"),
        v.literal("processing"),
        v.literal("ready"),
        v.literal("error")
      )
    ),
    search: v.optional(v.string()),
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id("skills"),
        _creationTime: v.number(),
        name: v.string(),
        description: v.string(),
        version: v.string(),
        category: v.string(),
        tags: v.array(v.string()),
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
        isActive: v.boolean(),
        downloadUrl: v.optional(v.string()),
        createdAt: v.number(),
      })
    ),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const skillsQuery = ctx.db.query("skills");

    // Apply filters
    let results = await skillsQuery.collect();

    if (args.category) {
      results = results.filter((skill) => skill.category === args.category);
    }

    if (args.status) {
      results = results.filter((skill) => skill.status === args.status);
    }

    const searchTerm = args.search?.toLowerCase();
    if (searchTerm) {
      const filteredSkills = results.filter((skill) => {
        const nameMatches = skill.name.toLowerCase().includes(searchTerm);
        const descriptionMatches = skill.description
          .toLowerCase()
          .includes(searchTerm);
        return nameMatches || descriptionMatches;
      });

      const startIndex = 0;
      const endIndex = Math.min(
        startIndex + args.paginationOpts.numItems,
        filteredSkills.length
      );
      const page = filteredSkills.slice(startIndex, endIndex);

      return {
        page: page.map((skill) => ({
          _id: skill._id,
          _creationTime: skill._creationTime,
          name: skill.name,
          description: skill.description,
          version: skill.version,
          category: skill.category,
          tags: skill.tags,
          status: skill.status,
          metadata: skill.metadata,
          isActive: skill.isActive,
          downloadUrl: skill.downloadUrl,
          createdAt: skill.createdAt,
        })),
        isDone: endIndex >= filteredSkills.length,
        continueCursor:
          endIndex < filteredSkills.length ? `cursor_${endIndex}` : null,
      };
    }

    return ctx.db.query("skills").order("desc").paginate(args.paginationOpts);
  },
});

export const getSkill = query({
  args: { id: v.id("skills") },
  returns: v.union(
    v.object({
      _id: v.id("skills"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      version: v.string(),
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
      isActive: v.boolean(),
      downloadUrl: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

export const getSkillVersions = query({
  args: { skillId: v.id("skills") },
  returns: v.array(
    v.object({
      _id: v.id("skillVersions"),
      _creationTime: v.number(),
      skillId: v.id("skills"),
      version: v.string(),
      changelog: v.string(),
      downloadUrl: v.string(),
      createdAt: v.number(),
      createdBy: v.optional(v.id("users")),
      fileSize: v.number(),
      pageCount: v.number(),
    })
  ),
  handler: async (ctx, args) =>
    await ctx.db
      .query("skillVersions")
      .withIndex("by_skill", (q) => q.eq("skillId", args.skillId))
      .order("desc")
      .collect(),
});

export const getSkillCategories = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("skillCategories"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      color: v.string(),
      icon: v.optional(v.string()),
      sortOrder: v.number(),
    })
  ),
  handler: async (ctx, _args) =>
    await ctx.db
      .query("skillCategories")
      .withIndex("by_sort_order")
      .order("asc")
      .collect(),
});

// Get all recent skill versions across all skills (for timeline view)
export const getAllSkillVersions = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("skillVersions"),
      _creationTime: v.number(),
      skillId: v.id("skills"),
      skillName: v.string(),
      version: v.string(),
      changelog: v.string(),
      downloadUrl: v.string(),
      createdAt: v.number(),
      createdBy: v.optional(v.id("users")),
      fileSize: v.number(),
      pageCount: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const versions = await ctx.db
      .query("skillVersions")
      .order("desc")
      .take(args.limit ?? 20);

    // Enrich with skill names
    const versionsWithSkillNames = await Promise.all(
      versions.map(async (version) => {
        const skill = await ctx.db.get(version.skillId);
        return {
          ...version,
          skillName: skill?.name ?? "Unknown Skill",
        };
      })
    );

    return versionsWithSkillNames;
  },
});

export const getActiveScrapingJobs = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("skillScrapingJobs"),
      _creationTime: v.number(),
      skillId: v.id("skills"),
      status: v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      ),
      progress: v.object({
        currentPage: v.number(),
        totalPages: v.number(),
        percentage: v.number(),
      }),
      startedAt: v.number(),
    })
  ),
  handler: async (ctx, _args) =>
    await ctx.db
      .query("skillScrapingJobs")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .collect(),
});

// Get skill analytics data for dashboard
export const getSkillAnalytics = query({
  args: {},
  returns: v.object({
    totalSkills: v.number(),
    statusCounts: v.object({
      ready: v.number(),
      processing: v.number(),
      scraping: v.number(),
      error: v.number(),
      draft: v.number(),
    }),
    categoryCounts: v.array(
      v.object({
        category: v.string(),
        count: v.number(),
      })
    ),
    totalPages: v.number(),
    recentActivity: v.array(
      v.object({
        skillName: v.string(),
        action: v.string(),
        status: v.string(),
        timestamp: v.number(),
      })
    ),
  }),
  handler: async (ctx) => {
    const skills = await ctx.db.query("skills").collect();

    // Count by status
    const statusCounts = {
      ready: 0,
      processing: 0,
      scraping: 0,
      error: 0,
      draft: 0,
    };
    for (const skill of skills) {
      statusCounts[skill.status]++;
    }

    // Count by category
    const categoryMap = new Map<string, number>();
    let totalPages = 0;
    for (const skill of skills) {
      const category = skill.category || "Uncategorized";
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      totalPages += skill.metadata?.pageCount || 0;
    }

    const categoryCounts = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Get recent activity (most recently updated skills)
    const recentSkills = skills
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);

    const recentActivity = recentSkills.map((skill) => ({
      skillName: skill.name,
      action:
        skill.status === "ready"
          ? "completed"
          : skill.status === "error"
            ? "failed"
            : skill.status,
      status: skill.status,
      timestamp: skill.updatedAt,
    }));

    return {
      totalSkills: skills.length,
      statusCounts,
      categoryCounts,
      totalPages,
      recentActivity,
    };
  },
});
