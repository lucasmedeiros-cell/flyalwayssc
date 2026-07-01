import type { TicketStatus } from "@vialta/types";
import type { BadgeTone } from "@vialta/ui";

export const TICKET_STATUS_TONE: Record<TicketStatus, BadgeTone> = {
  quote: "neutral",
  reserved: "warning",
  confirmed: "primary",
  issued: "success",
  cancelled: "danger",
  refunded: "danger",
  reissued: "accent",
};
