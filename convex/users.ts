import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Sync user data from WorkOS to Convex database
 *
 * Creates a new user if they don't exist, or updates existing user data.
 * This should be called after successful WorkOS authentication.
 *
 * @param workosUserId - Unique WorkOS user identifier
 * @param email - User's email address
 * @param firstName - User's first name (optional)
 * @param lastName - User's last name (optional)
 * @param profilePictureUrl - URL to user's profile picture (optional)
 * @param emailVerified - Whether the email has been verified
 * @returns Convex user ID
 */
export const syncFromWorkOS = mutation({
  args: {
    workosUserId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
    emailVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if user already exists by WorkOS ID
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_workos_id", (q) => q.eq("workosUserId", args.workosUserId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        profilePictureUrl: args.profilePictureUrl,
        emailVerified: args.emailVerified,
        updatedAt: now,
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      workosUserId: args.workosUserId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      profilePictureUrl: args.profilePictureUrl,
      emailVerified: args.emailVerified,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

/**
 * Get user by WorkOS user ID
 *
 * @param workosUserId - WorkOS user identifier
 * @returns User document or null if not found
 */
export const getByWorkOSId = query({
  args: {
    workosUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_workos_id", (q) => q.eq("workosUserId", args.workosUserId))
      .first();

    return user;
  },
});

/**
 * Get user by Convex ID
 *
 * @param userId - Convex user ID
 * @returns User document or null if not found
 */
export const getById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user;
  },
});

/**
 * Update user profile information
 *
 * Updates the user's profile with new information.
 * Only updates fields that are provided.
 *
 * @param userId - Convex user ID
 * @param firstName - Updated first name (optional)
 * @param lastName - Updated last name (optional)
 * @param profilePictureUrl - Updated profile picture URL (optional)
 * @returns Updated user document or null if user not found
 */
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Build update object with only provided fields
    const updates: {
      firstName?: string;
      lastName?: string;
      profilePictureUrl?: string;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.firstName !== undefined) {
      updates.firstName = args.firstName;
    }
    if (args.lastName !== undefined) {
      updates.lastName = args.lastName;
    }
    if (args.profilePictureUrl !== undefined) {
      updates.profilePictureUrl = args.profilePictureUrl;
    }

    await ctx.db.patch(args.userId, updates);

    // Return updated user
    const updatedUser = await ctx.db.get(args.userId);
    return updatedUser;
  },
});

/**
 * Get user by email address
 *
 * @param email - User's email address
 * @returns User document or null if not found
 */
export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return user;
  },
});

const orgRoleValidator = v.optional(
  v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
);

const systemRoleValidator = v.optional(
  v.union(v.literal("alias_admin"), v.literal("alias_support")),
);

export const assignToOrg = mutation({
  args: {
    userId: v.id("users"),
    orgId: v.id("orgs"),
    orgRole: orgRoleValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      orgId: args.orgId,
      orgRole: args.orgRole ?? "member",
      updatedAt: Date.now(),
    });

    return ctx.db.get(args.userId);
  },
});

export const setSystemRole = mutation({
  args: {
    userId: v.id("users"),
    systemRole: systemRoleValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      systemRole: args.systemRole,
      updatedAt: Date.now(),
    });

    return ctx.db.get(args.userId);
  },
});

export const removeFromOrg = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      orgId: undefined,
      orgRole: undefined,
      updatedAt: Date.now(),
    });

    return ctx.db.get(args.userId);
  },
});
