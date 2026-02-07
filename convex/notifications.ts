import { query } from "./_generated/server";

/**
 * Get unread notification count
 *
 * Stub implementation to prevent errors from components expecting this query.
 * Returns 0 until a proper notifications system is implemented.
 *
 * @returns Number of unread notifications (currently always 0)
 */
export const getUnreadNotificationCount = query({
  args: {},
  handler: async () => {
    // TODO: Implement proper notifications system
    // For now, return 0 to prevent errors
    return 0;
  },
});



