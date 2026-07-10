import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { Roles } from "@/enums";

const LOGIN_PATH = "/login";
const PUBLIC_PATHS = [LOGIN_PATH, "/forgot-password", "/reset-password"];
const STUDENT_HOME = "/student/dashboard";
const ADMIN_HOME = "/admin";
const PROFESSOR_HOME = "/professor/dashboard";

function redirectTo(path: string, request: NextRequest) {
  return NextResponse.redirect(new URL(path, request.url));
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("jwt");
  response.cookies.delete("refreshToken");
  response.cookies.delete("refreshTokenExpiresOn");
  return response;
}

function hasRole(roles: string | undefined, role: string) {
  return (
    roles
      ?.split(",")
      .map((item) => item.trim())
      .includes(role) ?? false
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt")?.value;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!token) {
    if (isPublicPath) {
      return NextResponse.next();
    }

    return redirectTo(LOGIN_PATH, request);
  }

  const decodedToken = verifyToken(token);
  const isExpired = decodedToken?.exp
    ? decodedToken.exp * 1000 <= Date.now()
    : true;

  if (!decodedToken || isExpired) {
    return clearAuthCookies(redirectTo(LOGIN_PATH, request));
  }

  const isStudent = hasRole(decodedToken.roles, Roles.Student);
  const isAdmin = hasRole(decodedToken.roles, Roles.Admin);
  const isAdvisor = hasRole(decodedToken.roles, Roles.Advisor);
  const isProfessor =
    hasRole(decodedToken.roles, Roles.Professor) ||
    hasRole(decodedToken.roles, Roles.Teacher);

  const isProfessorAreaUser = isProfessor || isAdvisor;

  if (isPublicPath) {
    if (isStudent) return redirectTo(STUDENT_HOME, request);
    if (isAdmin) return redirectTo(ADMIN_HOME, request);
    if (isProfessorAreaUser) return redirectTo(PROFESSOR_HOME, request);

    return redirectTo(STUDENT_HOME, request);
  }

  if (isStudent && !pathname.startsWith("/student")) {
    return redirectTo(STUDENT_HOME, request);
  }

  if (isAdmin && !pathname.startsWith("/admin")) {
    return redirectTo(ADMIN_HOME, request);
  }

  if (isProfessorAreaUser) {
    if (pathname === "/professor" || pathname === "/professor/") {
      return redirectTo(PROFESSOR_HOME, request);
    }

    if (!pathname.startsWith("/professor")) {
      return redirectTo(PROFESSOR_HOME, request);
    }

    const advisorOnlyPath =
      pathname.startsWith("/professor/students") ||
      pathname.startsWith("/professor/pending");

    if (advisorOnlyPath && !isAdvisor) {
      return redirectTo(PROFESSOR_HOME, request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};