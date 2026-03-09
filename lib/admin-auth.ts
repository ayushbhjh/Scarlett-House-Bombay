export const ADMIN_COOKIE_NAME = "admin_session";

export function getAdminUserId(): string {
  return process.env.ADMIN_USER_ID ?? "admin";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "admin123";
}

export function getAdminSessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? "scarlett-admin-session";
}

export function isAdminSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return cookieValue === getAdminSessionToken();
}
