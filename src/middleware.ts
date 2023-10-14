import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const isAuthenticated = await getToken({ req });

  const pathname = req.nextUrl.pathname;
  const isSignInPage = pathname === "/sign-in";

  if (isSignInPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && !isSignInPage && pathname !== "/") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/onboarding",
    "/expense-tracker",
    "/savings",
    "/investments",
    "/miscellaneous",
    "/dues",
    "/customize",
    "/overview",
    "/about",
    "/help",
    "/sign-in",
  ],
};
