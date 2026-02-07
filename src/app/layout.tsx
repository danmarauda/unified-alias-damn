import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./client-body";
import { Providers } from "./providers";
import { getServerAuth } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "ALIAS - AEOS",
  description: "Agentic Enterprise Operating System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch auth state server-side to avoid Server Action issues
  const initialAuth = await getServerAuth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers initialAuth={initialAuth}>
          <ClientBody>{children}</ClientBody>
        </Providers>
      </body>
    </html>
  );
}
