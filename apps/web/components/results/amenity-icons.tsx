import {
  Wifi,
  Plug,
  Usb,
  Snowflake,
  UtensilsCrossed,
  Cookie,
  MonitorPlay,
  Toilet,
  Armchair,
  Luggage,
  PawPrint,
  Accessibility,
  type LucideIcon,
} from "lucide-react";
import type { Amenity } from "@vialta/types";
import { AMENITY_LABEL } from "@vialta/types";

const ICONS: Record<Amenity, LucideIcon> = {
  wifi: Wifi,
  power: Plug,
  usb: Usb,
  ac: Snowflake,
  meal: UtensilsCrossed,
  snack: Cookie,
  entertainment: MonitorPlay,
  restroom: Toilet,
  reclining_seats: Armchair,
  luggage_included: Luggage,
  pets_allowed: PawPrint,
  wheelchair: Accessibility,
};

export function AmenityIcon({ amenity, className }: { amenity: Amenity; className?: string }) {
  const Icon = ICONS[amenity];
  return (
    <span title={AMENITY_LABEL[amenity]} className="inline-flex">
      <Icon className={className ?? "h-4 w-4"} aria-label={AMENITY_LABEL[amenity]} />
    </span>
  );
}
