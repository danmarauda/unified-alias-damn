"use client";

import {
  BarChart,
  Brain,
  Database,
  FileCode,
  Github,
  Layers,
  LogOut,
  Menu,
  RocketIcon,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useWorkOS } from "@/lib/hooks/use-work-os";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { workosUser, isAuthenticated } = useWorkOS();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Construct display name from WorkOS user
  const displayName = workosUser
    ? [workosUser.firstName, workosUser.lastName].filter(Boolean).join(" ") ||
      workosUser.email
    : "";
  const userEmail = workosUser?.email || "";
  const userImage = workosUser?.profilePictureUrl;

  return (
    <header className="relative flex items-center justify-between border-border border-b px-4 py-4 md:px-6">
      <div className="flex items-center space-x-4">
        <Link className="flex items-center" href="/">
          <Image
            alt="ALIAS AEOS Logo"
            className="mr-2"
            height={30}
            priority
            src="/images/alias-logo.svg"
            width={50}
          />
          <span className="font-normal text-xl tracking-wide">
            ALIAS - AEOS
          </span>
        </Link>
        <div className="ml-8 hidden font-light text-muted-foreground text-sm tracking-widest md:block">
          AGENTIC ENTERPRISE OPERATING SYSTEM
        </div>
      </div>

      <div className="hidden items-center space-x-4 md:flex">
        <ThemeToggle />

        <Link href="/ontology">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <Layers className="mr-1 h-4 w-4" />
            ONTOLOGY
          </Button>
        </Link>

        <Link href="/agents">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <Brain className="mr-1 h-4 w-4" />
            AGENTS
          </Button>
        </Link>

        <Link href="/projects">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <FileCode className="mr-1 h-4 w-4" />
            PROJECTS
          </Button>
        </Link>

        <Link href="/knowledge-base">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <Database className="mr-1 h-4 w-4" />
            KNOWLEDGE BASE
          </Button>
        </Link>

        <Link href="/research-hub">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <Search className="mr-1 h-4 w-4" />
            RESEARCH
          </Button>
        </Link>

        <Link href="/client-profiles">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <Users className="mr-1 h-4 w-4" />
            CLIENTS
          </Button>
        </Link>

        <Link href="/deploy">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <RocketIcon className="mr-1 h-4 w-4" />
            DEPLOY
          </Button>
        </Link>

        <Link href="/agents/metrics">
          <Button
            className="border-muted px-4 font-light text-xs tracking-wide"
            variant="outline"
          >
            <BarChart className="mr-1 h-4 w-4" />
            METRICS
          </Button>
        </Link>

        {isAuthenticated ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {userImage ? (
                <Image
                  alt={displayName || "User"}
                  className="rounded-full border border-border"
                  height={32}
                  src={userImage}
                  width={32}
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-neutral-800 text-neutral-100">
                  {displayName ? displayName[0].toUpperCase() : "U"}
                </div>
              )}
              <span className="hidden font-light text-sm lg:inline">
                {displayName}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-card py-1 shadow-lg">
                <div className="border-border border-b px-4 py-3">
                  <p className="font-medium text-sm">{displayName}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    {userEmail}
                  </p>
                </div>
                <Link
                  className="block flex items-center px-4 py-2 text-sm hover:bg-secondary"
                  href="/profile"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <Link
                  className="block flex items-center px-4 py-2 text-muted-foreground text-sm hover:bg-secondary"
                  href="/api/auth/logout"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Link>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <Button
              className="border-muted px-4 font-light text-xs tracking-wide"
              variant="outline"
            >
              SIGN IN
            </Button>
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-2 md:hidden">
        <ThemeToggle />

        <Button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          size="icon"
          variant="ghost"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full right-0 left-0 z-50 border-border border-b bg-background md:hidden">
          <div className="flex flex-col space-y-4 p-4">
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/ontology"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Layers className="mr-2 h-4 w-4" />
              ONTOLOGY
            </Link>
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/agents"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Brain className="mr-2 h-4 w-4" />
              AGENTS
            </Link>
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileCode className="mr-2 h-4 w-4" />
              PROJECTS
            </Link>
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/knowledge-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Database className="mr-2 h-4 w-4" />
              KNOWLEDGE BASE
            </Link>
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/research-hub"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="mr-2 h-4 w-4" />
              RESEARCH
            </Link>
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/client-profiles"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users className="mr-2 h-4 w-4" />
              CLIENTS
            </Link>
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/deploy"
              onClick={() => setMobileMenuOpen(false)}
            >
              <RocketIcon className="mr-2 h-4 w-4" />
              DEPLOY
            </Link>
            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="/agents/metrics"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart className="mr-2 h-4 w-4" />
              METRICS
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  className="flex items-center px-2 py-1 text-sm"
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile ({displayName})
                </Link>
                <Link
                  className="flex items-center px-2 py-1 text-muted-foreground text-sm"
                  href="/api/auth/logout"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Link>
              </>
            ) : (
              <Link
                className="px-2 py-1 text-sm"
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                SIGN IN
              </Link>
            )}

            <Link
              className="flex items-center px-2 py-1 text-sm"
              href="https://github.com/alias-mosaic"
              onClick={() => setMobileMenuOpen(false)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="mr-2 h-4 w-4" />
              GITHUB
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
