import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }

      if (pathname.startsWith("/teacher")) {
        return token?.role === "teacher";
      }

      if (pathname.startsWith("/student")) {
        return token?.role === "student";
      }

      return true;
    },
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
  ],
};

