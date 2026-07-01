"use client";

import { Download, Mail, MessageCircle } from "lucide-react";
import { Modal, Button, buttonClasses } from "@vialta/ui";

/** Modal genérico que muestra un documento imprimible + barra de acciones. */
export function DocumentModal({
  open,
  onClose,
  email,
  phone,
  subject,
  message,
  extraActions,
  children,
}: {
  open: boolean;
  onClose: () => void;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  extraActions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const waNumber = (phone ?? "").replace(/\D/g, "");
  const mailto = `mailto:${email ?? ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const wa = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Modal open={open} onClose={onClose} size="xl">
      {children}
      <div className="no-print mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="h-4 w-4" /> Descargar PDF
        </Button>
        {email && (
          <a href={mailto} className={buttonClasses({ variant: "outline", size: "sm" })}>
            <Mail className="h-4 w-4" /> Email
          </a>
        )}
        {waNumber && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "outline", size: "sm" })}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        )}
        {extraActions}
      </div>
    </Modal>
  );
}
