import type { QuoteStatus } from "@vialta/types";
import type { BadgeTone } from "@vialta/ui";

export const QUOTE_STATUS_TONE: Record<QuoteStatus, BadgeTone> = {
  draft: "neutral",
  sent: "primary",
  accepted: "success",
  rejected: "danger",
  expired: "warning",
  converted: "accent",
};
