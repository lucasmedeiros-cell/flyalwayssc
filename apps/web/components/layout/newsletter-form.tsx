"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Captura de newsletter (mock): valida formato y muestra confirmación.
 * Reciprocidad + retención — "ofertas exclusivas antes que nadie".
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="flex items-center gap-2.5 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-foreground">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
        ¡Listo! Te escribiremos con las mejores ofertas para viajar.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setDone(true);
      }}
      className="flex flex-col gap-2.5 sm:flex-row"
    >
      <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface px-4 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/25">
        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@email.com"
          aria-label="Correo electrónico"
          className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" size="md" className="shrink-0">
        Suscribirme
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
