import { createFileRoute } from "@tanstack/react-router";
import { BlueprintApp } from "@/components/app/shell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <BlueprintApp />;
}
