import type { DocumentKind } from "@vialta/types";
import type { BadgeTone } from "@vialta/ui";
import { FileText, Receipt, FileMinus, Ticket, Map, CheckCircle2, FileSignature, type LucideIcon } from "lucide-react";

export const DOC_KIND_TONE: Record<DocumentKind, BadgeTone> = {
  invoice: "primary",
  receipt: "success",
  credit_note: "danger",
  voucher: "accent",
  itinerary: "neutral",
  confirmation: "primary",
  contract: "warning",
};

export const DOC_KIND_ICON: Record<DocumentKind, LucideIcon> = {
  invoice: FileText,
  receipt: Receipt,
  credit_note: FileMinus,
  voucher: Ticket,
  itinerary: Map,
  confirmation: CheckCircle2,
  contract: FileSignature,
};
