"use client";

import type { Id } from "../../../convex/_generated/dataModel";
import { useWorkOS } from "@/lib/hooks/use-work-os";
import { createContext, useContext } from "react";

type OrgRole = "owner" | "admin" | "member";

type OrgContextType = {
  orgId: Id<"orgs"> | null;
  orgName: string | null;
  orgRole: OrgRole | null;
  isAliasStaff: boolean;
  canViewAllOrgs: boolean;
  isLoading: boolean;
};

const OrgContext = createContext<OrgContextType | null>(null);

type OrgProviderProps = {
  children: React.ReactNode;
};

export function OrgProvider({ children }: OrgProviderProps) {
  const { org, orgRole, isAliasStaff, canViewAllOrgs, isLoading } = useWorkOS();

  const value: OrgContextType = {
    orgId: org?._id ?? null,
    orgName: org?.name ?? null,
    orgRole,
    isAliasStaff,
    canViewAllOrgs,
    isLoading,
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg(): OrgContextType {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within OrgProvider");
  }
  return context;
}

export function useOrgOptional(): OrgContextType | null {
  return useContext(OrgContext);
}
