import { Badge } from "@/components/shared/Badge";

export function PlanBadge({ plan = "Pro" }: { plan?: string }) {
  return <Badge tone="blue">{plan}</Badge>;
}
