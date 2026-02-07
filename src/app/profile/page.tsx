"use client";

import { AtSign, Calendar, Edit, Lock, Save, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";

// Helper to get display name from WorkOS user
function getDisplayName(
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
  } | null,
): string {
  if (!user) return "";
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  return user.email || "";
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const displayName = getDisplayName(user);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (!(isLoading || isAuthenticated)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(getDisplayName(user));
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = () => {
    // In a real app, we would send this to the API
    setIsEditing(false);
  };

  if (!(isLoading || isAuthenticated)) {
    return null;
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-primary border-t-2" />
            <p className="mt-2 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="font-light text-2xl">User Profile</h1>
          <Button
            className="ml-auto bg-primary text-black hover:bg-primary/90"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-border bg-card md:col-span-1">
            <CardHeader className="border-border border-b text-center">
              <CardTitle className="font-normal text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4">
                {user?.profilePictureUrl ? (
                  <Image
                    alt={displayName || "User"}
                    className="rounded-full border-4 border-background"
                    height={100}
                    src={user.profilePictureUrl}
                    width={100}
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl text-black">
                    {displayName ? displayName[0] : "U"}
                  </div>
                )}
              </div>

              <h2 className="font-medium text-xl">{displayName}</h2>
              <p className="text-muted-foreground">{user?.email}</p>

              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center border-border border-t pt-4">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Member Since</div>
                    <div>May 16, 2025</div>
                  </div>
                </div>

                <div className="flex items-center border-border border-t pt-4">
                  <AtSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Email</div>
                    <div>{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center border-border border-t pt-4">
                  <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Account Type</div>
                    <div>
                      {user?.email?.includes("admin")
                        ? "Administrator"
                        : "Standard User"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 md:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader className="border-border border-b">
                <CardTitle className="font-normal text-lg">
                  Account Information
                </CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <label className="text-sm">Full Name</label>
                  {isEditing ? (
                    <Input
                      className="bg-background"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  ) : (
                    <div className="rounded-md border border-border bg-background/50 p-2">
                      {displayName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Email Address</label>
                  {isEditing ? (
                    <Input
                      className="bg-background"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  ) : (
                    <div className="rounded-md border border-border bg-background/50 p-2">
                      {user?.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Password</label>
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        className="bg-background"
                        placeholder="Current password"
                        type="password"
                      />
                      <Input
                        className="bg-background"
                        placeholder="New password"
                        type="password"
                      />
                      <Input
                        className="bg-background"
                        placeholder="Confirm new password"
                        type="password"
                      />
                    </div>
                  ) : (
                    <div className="rounded-md border border-border bg-background/50 p-2">
                      ••••••••••
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="border-border border-b">
                <CardTitle className="font-normal text-lg">
                  Agent Usage
                </CardTitle>
                <CardDescription>Your AI agent activity</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-md border border-border bg-background/50 p-4">
                    <div className="mb-1 text-muted-foreground text-sm">
                      Total Interactions
                    </div>
                    <div className="font-light text-2xl text-primary">384</div>
                  </div>

                  <div className="rounded-md border border-border bg-background/50 p-4">
                    <div className="mb-1 text-muted-foreground text-sm">
                      Agents Created
                    </div>
                    <div className="font-light text-2xl text-primary">3</div>
                  </div>

                  <div className="rounded-md border border-border bg-background/50 p-4">
                    <div className="mb-1 text-muted-foreground text-sm">
                      Success Rate
                    </div>
                    <div className="font-light text-2xl text-primary">94%</div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 font-medium text-sm">Recent Agents</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-primary" />
                        <span>Dria Support Agent</span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Last used: 2 hours ago
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-primary" />
                        <span>Code Helper</span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Last used: Yesterday
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
