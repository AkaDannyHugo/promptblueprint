import { createServerFn } from "@tanstack/react-start";

export const getShareHost = createServerFn({ method: "GET" }).handler(async () => {
  const { shareHostFromRequest } = await import("./share-host.server");
  return shareHostFromRequest();
});
