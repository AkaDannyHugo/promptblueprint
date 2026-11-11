import { getRequestHeader } from "@tanstack/react-start/server";

function publicAppHost(hostHeader: string | null | undefined): string {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  ) {
    return "";
  }
  return host;
}

/** Same public-host guard the injector uses for og:image. */
export function shareHostFromRequest(): string {
  const published = publicAppHost(process.env.VITE_PUBLIC_HOSTNAME);
  if (published) return published;
  const forwarded = getRequestHeader("x-forwarded-host");
  const host = getRequestHeader("host");
  return publicAppHost(forwarded || host || "");
}
