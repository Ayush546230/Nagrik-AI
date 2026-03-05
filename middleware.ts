import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ── Public routes ──
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/role-select",
  "/pending-approval",
  "/api/auth/register",
  "/role-redirect", // Yeh abhi bhi public list mein hai taaki middleware ise intercept kar sake
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isWorkerRoute = createRouteMatcher(["/worker(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // 1. Allow public routes first
  if (isPublicRoute(req) && !req.nextUrl.pathname.startsWith("/role-redirect")) {
    return NextResponse.next();
  }

  // 2. Protect and get session data
  const { userId, sessionClaims } = await auth.protect();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 3. Get role from Clerk session metadata
  // Note: Ensure your JWT template matches this structure
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role ?? "citizen";

  const { pathname } = req.nextUrl;

  // 4. FIX: Handle redirection inside Middleware (Solves the "Rendering" pause)
  if (pathname === "/role-redirect" || pathname === "/") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (role === "worker") return NextResponse.redirect(new URL("/worker/dashboard", req.url));
    if (role === "pending_worker") return NextResponse.redirect(new URL("/pending-approval", req.url));

    // Default dashboard for citizens
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 5. Route Protection Logic
  if (isAdminRoute(req) && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isWorkerRoute(req) && role !== "worker") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};