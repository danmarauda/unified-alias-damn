"use client";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { CustomAuthProvider } from "@/lib/auth-context";
import type { AuthSession } from "@/lib/auth-server";
import { OrgProvider } from "@/lib/contexts/org-context";
import { ThemeProvider } from "next-themes";

type ProvidersProps = {
  children: React.ReactNode;
  initialAuth: AuthSession;
};

export function Providers({ children, initialAuth }: ProvidersProps) {
  return (
    <CustomAuthProvider initialAuth={initialAuth}>
      <ConvexClientProvider>
        <OrgProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </OrgProvider>
      </ConvexClientProvider>
    </CustomAuthProvider>
  );
}
