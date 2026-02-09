import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  const locale = request.nextUrl.pathname.split("/")[1] || "de";
  if (routing.locales.includes(locale as (typeof routing.locales)[number])) {
    response.headers.set("x-next-locale", locale);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/(de|en|es|fr|it|pt|ru|zh|ja|ar|hi|tr|pl|nl|vi|ko|uk|th|id|cs|fa)/:path*",
  ],
};
