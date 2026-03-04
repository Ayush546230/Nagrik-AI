import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import type { UserRole, IUser } from "@/types";


// GET CURRENT USER FROM DB

export async function getCurrentUser(): Promise<IUser | null> {
  const { userId } = await auth();
  if (!userId) return null;

  await connectDB();
  return User.findOne({ clerkId: userId }).lean();
}


// REQUIRE AUTH

export async function requireAuth(): Promise<IUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}


// REQUIRE ROLE

export async function requireRole(allowedRoles: UserRole[]): Promise<IUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }
  return user;
}


// ROLE HELPERS

export const isAdmin = (role: UserRole) => role === "admin";
export const isWorker = (role: UserRole) => role === "worker";
export const isCitizen = (role: UserRole) => role === "citizen";

export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "worker":
      return "/worker/dashboard";
    default:
      return "/dashboard";
  }
}