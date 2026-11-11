import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { useBlueprint } from "@/lib/blueprint/store";
import { getShareHost } from "@/lib/og/share-host";
import appCss from "../styles.css?url";

const APP_NAME = "Prompt Blueprint";

const THEME_BOOT = `(function(){document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");})();`;

export const Route = createRootRoute({
  loader: async () => {
    try {
      return await getShareHost();
    } catch {
      return "";
    }
  },
  head: ({ loaderData }) => {
    const host = typeof loaderData === "string" ? loaderData : "";
    const xBanner = host ? `https://${host}/x-banner.jpg` : "";
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: APP_NAME },
        { name: "theme-color", content: "#0b0c0e" },
        {
          name: "description",
          content:
            "A Grok contract for a Coinbase crypto screen. It does not trade.",
        },
        ...(xBanner
          ? [{ property: "x:game:image", content: xBanner } as const]
          : []),
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      ],
    };
  },
  component: RootDocument,
});

function AppToaster() {
  const dark = useBlueprint((s) => s.config.darkMode);
  return (
    <Toaster
      position="top-center"
      offset={16}
      theme={dark ? "dark" : "light"}
      toastOptions={{
        className: "font-sans",
        style: {
          background: "var(--elevated)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-border)",
        },
      }}
    />
  );
}

function RootDocument() {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <AppToaster />
        <Scripts />
      </body>
    </html>
  );
}
