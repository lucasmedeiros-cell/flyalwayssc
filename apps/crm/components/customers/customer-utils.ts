import type { CustomerStatus } from "@vialta/types";
import type { BadgeTone } from "@vialta/ui";

export const STATUS_TONE: Record<CustomerStatus, BadgeTone> = {
  active: "success",
  vip: "accent",
  prospect: "warning",
  inactive: "neutral",
};
