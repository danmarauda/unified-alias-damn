import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema
 *
 * Updated to support WorkOS authentication with user profile management.
 * All existing tables (stats, activities, metrics) are preserved for backward compatibility.
 */
export default defineSchema({
  /**
   * Organizations table - Multi-tenancy root
   *
   * Maps WorkOS organizations to Convex for multi-tenant observability.
   * Every telemetry row belongs to exactly one orgId.
   */
  orgs: defineTable({
    workosOrgId: v.string(), // From WorkOS organization
    name: v.string(),
    plan: v.optional(
      v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    ),
    settings: v.optional(
      v.object({
        retentionDays: v.optional(v.number()),
        alertsEnabled: v.optional(v.boolean()),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_workosOrgId", ["workosOrgId"]),

  /**
   * Users table - WorkOS authentication integration
   *
   * Stores user profile data synced from WorkOS authentication.
   * Each user is uniquely identified by their WorkOS user ID.
   * Extended with organization membership and ALIAS staff roles.
   */
  users: defineTable({
    workosUserId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    emailVerified: v.boolean(),

    // Organization membership (optional for backward compatibility)
    orgId: v.optional(v.id("orgs")),
    orgRole: v.optional(
      v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    ),

    // ALIAS staff roles (cross-org access)
    systemRole: v.optional(
      v.union(v.literal("alias_admin"), v.literal("alias_support")),
    ),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workos_id", ["workosUserId"])
    .index("by_email", ["email"])
    .index("by_orgId", ["orgId"]),

  // Stats for dashboard metrics
  stats: defineTable({
    type: v.string(), // "activeUsers", "ontologyEntities", etc.
    value: v.number(),
    timestamp: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_timestamp", ["timestamp"]),

  // Project activities for the globe visualization
  projectActivities: defineTable({
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    type: v.string(), // "development", "testing", "deployment", "planning"
    action: v.string(),
    project: v.string(),
    importance: v.number(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_type", ["type"]),

  // Recent activities feed
  recentActivities: defineTable({
    action: v.string(),
    type: v.string(),
    time: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),

  // Project performance metrics
  projectPerformance: defineTable({
    name: v.string(),
    velocity: v.number(),
    qualityScore: v.number(),
    budget: v.string(),
    budgetStatus: v.string(), // "stable", "positive", "negative"
    timeline: v.string(),
    timelineStatus: v.string(), // "stable", "positive", "negative"
    stakeholderSatisfaction: v.number(),
  }).index("by_name", ["name"]),

  // Agent activities
  agentActivities: defineTable({
    agent: v.string(),
    action: v.string(),
    project: v.string(),
    timestamp: v.number(),
    status: v.string(), // "completed", "in-progress", "failed"
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_status", ["status"]),

  // Agent metrics data
  agentMetrics: defineTable({
    metricType: v.union(
      v.literal("summary"),
      v.literal("distribution"),
      v.literal("timeseries"),
    ),
    // Typed data structure based on metricType
    data: v.union(
      // Summary metrics
      v.object({
        totalRequests: v.number(),
        successRate: v.number(),
        failureRate: v.number(),
        averageLatency: v.number(),
        totalTokensConsumed: v.number(),
      }),
      // Distribution metrics (agent type breakdown)
      v.object({
        distribution: v.array(
          v.object({
            name: v.string(),
            value: v.number(),
          }),
        ),
      }),
      // Time series metrics
      v.object({
        series: v.array(
          v.object({
            timestamp: v.union(v.string(), v.number()),
            value: v.number(),
          }),
        ),
        seriesType: v.optional(v.string()),
      }),
    ),
    timestamp: v.number(),
  }).index("by_type_timestamp", ["metricType", "timestamp"]),

  // Agent calls log
  // Skills management tables
  skills: defineTable({
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
        }),
      ),
      aiEnhancement: v.optional(v.boolean()),
      includeCode: v.optional(v.boolean()),
    }),
    status: v.union(
      v.literal("draft"),
      v.literal("scraping"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("error"),
    ),
    metadata: v.optional(
      v.object({
        pageCount: v.optional(v.number()),
        fileSize: v.optional(v.number()),
        lastScraped: v.optional(v.number()),
        errorMessage: v.optional(v.string()),
      }),
    ),
    isActive: v.boolean(),
    downloadUrl: v.optional(v.string()),
    createdBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_name_version", ["name", "version"])
    .index("by_created_by", ["createdBy"]),

  skillVersions: defineTable({
    skillId: v.id("skills"),
    version: v.string(),
    changelog: v.string(),
    config: v.object({
      sourceUrl: v.string(),
      maxPages: v.optional(v.number()),
      selectors: v.optional(
        v.object({
          content: v.optional(v.string()),
          links: v.optional(v.string()),
          code: v.optional(v.string()),
        }),
      ),
      aiEnhancement: v.optional(v.boolean()),
      includeCode: v.optional(v.boolean()),
    }),
    downloadUrl: v.string(),
    createdAt: v.number(),
    createdBy: v.optional(v.id("users")),
    fileSize: v.number(),
    pageCount: v.number(),
  })
    .index("by_skill", ["skillId"])
    .index("by_skill_version", ["skillId", "version"]),

  skillScrapingJobs: defineTable({
    skillId: v.id("skills"),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    config: v.object({
      sourceUrl: v.string(),
      maxPages: v.optional(v.number()),
      selectors: v.optional(
        v.object({
          content: v.optional(v.string()),
          links: v.optional(v.string()),
          code: v.optional(v.string()),
        }),
      ),
      aiEnhancement: v.optional(v.boolean()),
      includeCode: v.optional(v.boolean()),
    }),
    progress: v.object({
      currentPage: v.number(),
      totalPages: v.number(),
      percentage: v.number(),
    }),
    results: v.optional(
      v.object({
        pagesScraped: v.number(),
        filesGenerated: v.number(),
        downloadUrl: v.optional(v.string()),
        errorMessage: v.optional(v.string()),
      }),
    ),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    workerId: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_skill", ["skillId"]),

  skillCategories: defineTable({
    name: v.string(),
    description: v.string(),
    color: v.string(),
    icon: v.optional(v.string()),
    sortOrder: v.number(),
  }).index("by_sort_order", ["sortOrder"]),

  agentCalls: defineTable({
    agentType: v.string(),
    projectName: v.string(),
    status: v.string(),
    username: v.string(),
    timestamp: v.number(),
    duration: v.number(),
    promptTokens: v.number(),
    completionTokens: v.number(),
    totalTokens: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_status", ["status"])
    .index("by_duration", ["duration"]),

  // Client profiles for research functionality
  clientProfiles: defineTable({
    name: v.string(),
    industry: v.string(),
    size: v.string(), // "small", "medium", "large", "enterprise"
    location: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("prospect"),
      v.literal("inactive"),
    ),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_industry", ["industry"])
    .index("by_status", ["status"])
    .searchIndex("search_name", { searchField: "name" }),

  // Client research table - comprehensive research management
  clientResearch: defineTable({
    /* Foreign keys */
    clientId: v.id("clientProfiles"),

    /* Core content */
    title: v.string(),
    summary: v.string(),
    findings: v.string(), // Will store Markdown or stringified JSON from Research Protocol
    attachments: v.array(v.string()), // URLs or Convex storage IDs

    /* Workflow */
    status: v.union(
      v.literal("draft"),
      v.literal("awaiting_approval"),
      v.literal("approved"),
      v.literal("published"),
    ),
    requestedBy: v.id("users"),
    createdBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    approvalNotes: v.optional(v.string()),
    reviewDue: v.optional(v.number()), // Timestamp

    /* Agent collaboration & QC */
    assignedAgents: v.array(v.id("users")),
    qaStatus: v.union(
      v.literal("pending"),
      v.literal("passed"),
      v.literal("revisions_requested"),
    ),
    qaBy: v.optional(v.id("users")),
    qaNotes: v.optional(v.string()),
    qualityScore: v.optional(v.number()), // 0-100
    factCheckScore: v.optional(v.number()), // 0-100

    /* Metadata */
    tags: v.array(v.string()),
    riskScore: v.optional(v.number()), // 0-100, internal
    sourceCount: v.number(),
    revision: v.number(),

    /* Timestamps */
    updatedAt: v.number(), // Timestamp of last update
    approvedAt: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
  })
    .index("by_clientId", ["clientId"])
    .index("by_status", ["status"])
    .index("by_requestedBy", ["requestedBy"])
    .index("by_createdBy", ["createdBy"]),

  /**
   * ALIAS Hivemind V3 Observability Tables
   * Real-time tracking for BIG 3 SUPER AGENT (Voice, Browser, Multi-LLM)
   */

  // Multi-agent observability events (main event stream)
  observabilityEvents: defineTable({
    orgId: v.optional(v.id("orgs")), // Optional for backward compatibility
    sessionId: v.string(),
    sourceApp: v.union(
      v.literal("hivemind-v3"),
      v.literal("voice-controller"),
      v.literal("browser-validator"),
      v.literal("llm-router"),
      v.literal("claude-code"),
      v.literal("agent-orchestrator"),
    ),
    eventType: v.union(
      v.literal("VoiceCommand"),
      v.literal("BrowserAction"),
      v.literal("LLMRoute"),
      v.literal("AgentSpawn"),
      v.literal("NeuralActivation"),
      v.literal("ToolCall"),
      v.literal("Error"),
      v.literal("Metric"),
    ),
    agentName: v.optional(v.string()),
    squadron: v.optional(
      v.union(
        v.literal("data"),
        v.literal("knowledge"),
        v.literal("validation"),
      ),
    ),

    action: v.string(), // Human-readable action description

    // Typed payload based on event context
    payload: v.optional(
      v.object({
        input: v.optional(v.string()),
        output: v.optional(v.string()),
        toolName: v.optional(v.string()),
        parameters: v.optional(v.record(v.string(), v.string())),
        error: v.optional(v.string()),
        context: v.optional(v.string()),
      }),
    ),

    // LLM tracking
    llmProvider: v.optional(
      v.union(
        v.literal("openai"),
        v.literal("anthropic"),
        v.literal("google"),
        v.literal("cerebras"),
        v.literal("groq"),
        v.literal("mistral"),
        v.literal("deepseek"),
        v.literal("cohere"),
        v.literal("perplexity"),
        v.literal("xai"),
        v.literal("azure"),
        v.literal("bedrock"),
        v.literal("vertex"),
      ),
    ),
    llmModel: v.optional(v.string()),
    tokensUsed: v.optional(v.number()),
    costEstimate: v.optional(v.number()),

    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    duration: v.optional(v.number()), // ms

    // Typed metadata
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        requestId: v.optional(v.string()),
        parentEventId: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
      }),
    ),
    timestamp: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_source", ["sourceApp"])
    .index("by_type", ["eventType"])
    .index("by_squadron", ["squadron"])
    .index("by_org_ts", ["orgId", "timestamp"]),

  // UCE Neural Network activations (35 neurons)
  uceNeuralActivations: defineTable({
    sessionId: v.string(),
    neuronId: v.string(), // "uce-01" to "uce-35"
    neuronName: v.string(), // "voice-intent-recognition", "browser-state-tracking", etc.
    activationLevel: v.number(), // 0.0 - 1.0
    weight: v.number(),
    context: v.string(), // What triggered this activation
    timestamp: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_neuron", ["neuronId"])
    .index("by_timestamp", ["timestamp"]),

  // Squadron status tracking (3 squadrons × 9 agents each = 27 total)
  squadronStatus: defineTable({
    squadronName: v.string(), // "data", "knowledge", "validation"
    activeAgents: v.number(),
    totalAgents: v.number(), // Always 9 per squadron
    currentTasks: v.array(v.string()),
    performanceScore: v.number(), // 0-100
    timestamp: v.number(),
  })
    .index("by_squadron", ["squadronName"])
    .index("by_timestamp", ["timestamp"]),
});
