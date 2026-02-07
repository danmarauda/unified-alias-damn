"use client";

import { useCustomAuth } from "@/lib/auth-context";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type WorkOSUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
  emailVerified: boolean;
};

type OrgRole = "owner" | "admin" | "member";
type SystemRole = "alias_admin" | "alias_support";

type ConvexUser = {
  _id: Id<"users">;
  workosUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  emailVerified: boolean;
  orgId?: Id<"orgs">;
  orgRole?: OrgRole;
  systemRole?: SystemRole;
  createdAt: number;
  updatedAt: number;
};

type Org = {
  _id: Id<"orgs">;
  workosOrgId: string;
  name: string;
  plan?: "free" | "pro" | "enterprise";
  settings?: {
    retentionDays?: number;
    alertsEnabled?: boolean;
  };
  createdAt: number;
  updatedAt: number;
};

type UseWorkOSReturn = {
  workosUser: WorkOSUser | null;
  convexUser: ConvexUser | null;
  org: Org | null;
  orgRole: OrgRole | null;
  isAliasStaff: boolean;
  canViewAllOrgs: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export function useWorkOS(): UseWorkOSReturn {
  const { user, loading } = useCustomAuth();
  const [syncAttempted, setSyncAttempted] = useState(false);

  const convexUser = useQuery(
    api.users.getByWorkOSId,
    user?.id ? { workosUserId: user.id } : "skip",
  );

  const org = useQuery(
    api.orgs.getById,
    convexUser?.orgId ? { orgId: convexUser.orgId } : "skip",
  );

  const syncFromWorkOS = useMutation(api.users.syncFromWorkOS);

  useEffect(() => {
    const syncUser = async () => {
      if (user && !loading && convexUser === null && !syncAttempted) {
        setSyncAttempted(true);
        try {
          await syncFromWorkOS({
            workosUserId: user.id,
            email: user.email,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            profilePictureUrl: user.profilePictureUrl || undefined,
            emailVerified: user.emailVerified,
          });
        } catch {
          setSyncAttempted(false);
        }
      }
    };

    syncUser();
  }, [user, loading, convexUser, syncAttempted, syncFromWorkOS]);

  const isLoading =
    loading ||
    (user !== null && convexUser === undefined) ||
    !!(convexUser?.orgId && org === undefined);
  const isAuthenticated = !!(user && convexUser);
  const isAliasStaff = !!convexUser?.systemRole;
  const canViewAllOrgs = isAliasStaff;

  return {
    workosUser: user as WorkOSUser | null,
    convexUser: convexUser as ConvexUser | null,
    org: (org as Org) ?? null,
    orgRole: (convexUser?.orgRole as OrgRole) ?? null,
    isAliasStaff,
    canViewAllOrgs,
    isLoading,
    isAuthenticated,
  };
}
