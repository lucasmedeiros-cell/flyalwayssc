import type { PaymentStatus, PaymentMethod } from "@vialta/types";
import type { BadgeTone } from "@vialta/ui";
import { Banknote, CreditCard, QrCode, ArrowLeftRight, Wallet, type LucideIcon } from "lucide-react";

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, BadgeTone> = {
  pending: "warning",
  partial: "primary",
  paid: "success",
  refunded: "danger",
};

export const PAYMENT_METHOD_ICON: Record<PaymentMethod, LucideIcon> = {
  cash: Banknote,
  card: CreditCard,
  qr: QrCode,
  transfer: ArrowLeftRight,
  paypal: Wallet,
  stripe: Wallet,
};
