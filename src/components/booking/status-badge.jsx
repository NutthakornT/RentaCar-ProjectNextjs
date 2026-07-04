import { Badge } from "@/components/ui/badge";

/** @type {Record<import("@/types").BookingStatus, {tone: string, label: string}>} */
const map = {
  confirmed: { tone: "info", label: "Confirmed" },
  active: { tone: "success", label: "Active" },
  completed: { tone: "neutral", label: "Completed" },
  cancelled: { tone: "danger", label: "Cancelled" },
};

/** @param {{ status: import("@/types").BookingStatus }} props */
export function BookingStatusBadge({ status }) {
  const { tone, label } = map[status] ?? map.confirmed;
  return <Badge tone={tone}>{label}</Badge>;
}
