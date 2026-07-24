import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16: "middleware" is now "proxy" (same behavior).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all routes except Next internals and static assets.
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icon.png|apple-icon.png|icon-192.png|icon-512.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
