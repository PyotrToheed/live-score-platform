import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar", "fa"];
const defaultLocale = "en";

export default withAuth(
    function middleware(request: NextRequest) {
        const { pathname } = request.nextUrl;

        // Skip static files and API routes (except those we want to handle)
        if (
            pathname.startsWith("/_next") ||
            pathname.includes(".") ||
            pathname.startsWith("/api") ||
            pathname.startsWith("/admin") // Admin matches will be handled by withAuth but we skip i18n redirect for them
        ) {
            return;
        }

        // Check if the current pathname has a supported locale
        const pathnameHasLocale = locales.some(
            (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
        );

        if (pathnameHasLocale) return;

        // Redirect if there is no locale
        request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                // Only require authentication for paths starting with /admin (excluding login)
                if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
                    return !!token;
                }
                return true;
            },
        },
        pages: {
            signIn: "/admin/login",
        },
    }
);

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};

