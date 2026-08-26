const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || "https://sumangalipattucenter.com/api/CmsApi.php";
const LOGIN_API_URL = import.meta.env.VITE_LOGIN_API_URL || "/api/LoginApi.php";
const ACCESS_TOKEN_KEY = "spc_admin_access_token";
const REFRESH_TOKEN_KEY = "spc_admin_refresh_token";

type ApiResponse<T = undefined> = { success: boolean; message: string } & T;

export type AuthTokens = { access_token: string; refresh_token: string; access_expires_in: number };

export function storeAuthTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

export function clearAuthTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit, retried = false): Promise<ApiResponse<T>> {
  const headers = new Headers(init?.headers);
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const response = await fetch(input, { credentials: "include", ...init, headers });
  const result = await response.json().catch(() => null) as ApiResponse<T> | null;
  if (response.status === 401 && !retried && input !== LOGIN_API_URL && await refreshAuthTokens()) {
    return request<T>(input, init, true);
  }
  if (!response.ok || !result?.success) throw new Error(result?.message || "Unable to contact the CMS server.");
  return result;
}

export async function refreshAuthTokens(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;
  try {
    const response = await fetch(LOGIN_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refresh_token", refresh_token: refreshToken }) });
    const result = await response.json() as ApiResponse<AuthTokens>;
    if (!response.ok || !result.success || !result.access_token || !result.refresh_token) throw new Error();
    storeAuthTokens(result);
    return true;
  } catch {
    clearAuthTokens();
    return false;
  }
}

export async function loadCmsSection<T>(section: string): Promise<T | null> {
  const result = await request<{ content: T | null }>(`${CMS_API_URL}?section=${encodeURIComponent(section)}`);
  return result.content;
}

export async function saveCmsSection(section: string, content: unknown): Promise<void> {
  await request(CMS_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", section, content }) });
}

export async function uploadCmsImage(file: File, scope: "service" | "gallery" | "logo"): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error("Image size must be 10 MB or less.");
  const form = new FormData();
  form.append("action", "upload");
  form.append("scope", scope);
  form.append("image", file);
  const result = await request<{ url: string }>(CMS_API_URL, { method: "POST", body: form });
  return result.url;
}
