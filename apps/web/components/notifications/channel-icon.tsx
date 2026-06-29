import { Mail, MessageSquareText, BellRing, MessageCircle } from "lucide-react";
import type { NotificationChannel } from "@vialta/types";
import { CHANNEL_LABEL } from "@vialta/types";
import { cn } from "@/lib/utils";

const ICON: Record<NotificationChannel, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  sms: MessageSquareText,
  push: BellRing,
  whatsapp: MessageCircle,
};

const TONE: Record<NotificationChannel, string> = {
  email: "bg-primary/12 text-primary",
  sms: "bg-accent/14 text-accent-strong dark:text-accent",
  push: "bg-warning/16 text-warning",
  whatsapp: "bg-success/14 text-success",
};

export function ChannelIcon({
  channel,
  className,
}: {
  channel: NotificationChannel;
  className?: string;
}) {
  const Icon = ICON[channel];
  return (
    <span
      title={CHANNEL_LABEL[channel]}
      className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", TONE[channel], className)}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

export { ICON as CHANNEL_ICON, TONE as CHANNEL_TONE };
