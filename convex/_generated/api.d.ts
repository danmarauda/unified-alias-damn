/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentMetrics from "../agentMetrics.js";
import type * as clientProfiles from "../clientProfiles.js";
import type * as clientResearch from "../clientResearch.js";
import type * as http from "../http.js";
import type * as initDemo from "../initDemo.js";
import type * as notifications from "../notifications.js";
import type * as observability from "../observability.js";
import type * as orgs from "../orgs.js";
import type * as skills from "../skills.js";
import type * as skills_mutations from "../skills_mutations.js";
import type * as stats from "../stats.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentMetrics: typeof agentMetrics;
  clientProfiles: typeof clientProfiles;
  clientResearch: typeof clientResearch;
  http: typeof http;
  initDemo: typeof initDemo;
  notifications: typeof notifications;
  observability: typeof observability;
  orgs: typeof orgs;
  skills: typeof skills;
  skills_mutations: typeof skills_mutations;
  stats: typeof stats;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
