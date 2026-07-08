"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Bot,
  Send,
  Check,
  CheckCheck,
  Star,
  Pin,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Hand,
  Paperclip,
  Smile,
  Phone,
} from "lucide-react";
import { Avatar, Badge, cn } from "@vialta/ui";
import {
  VENDEDOR_CHATS,
  LEAD_STAGE_LABEL,
  LEAD_STAGE_TONE,
  TEMP_META,
  type Chat,
  type Message,
} from "@/lib/vendedor";

type Filter = "todos" | "no_leidos" | "bot" | "favoritos";

/** Hora corta (hoy → HH:mm; si no → dd/mm). */
function timeShort(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return d.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit" });
}

function Ticks({ status }: { status?: Message["status"] }) {
  if (!status) return null;
  if (status === "read") return <CheckCheck className="h-3.5 w-3.5 text-sky-400" />;
  if (status === "delivered") return <CheckCheck className="h-3.5 w-3.5 text-white/55" />;
  return <Check className="h-3.5 w-3.5 text-white/55" />;
}

export function VendedorView() {
  const [chats, setChats] = useState<Chat[]>(VENDEDOR_CHATS);
  const [activeId, setActiveId] = useState<string | null>(VENDEDOR_CHATS[0]?.id ?? null);
  const [filter, setFilter] = useState<Filter>("todos");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = chats.find((c) => c.id === activeId) ?? null;

  const counts = useMemo(
    () => ({
      no_leidos: chats.filter((c) => c.unread > 0).length,
      bot: chats.filter((c) => c.botActive).length,
      favoritos: chats.filter((c) => c.favorite).length,
    }),
    [chats],
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chats
      .filter((c) => {
        if (filter === "no_leidos" && c.unread === 0) return false;
        if (filter === "bot" && !c.botActive) return false;
        if (filter === "favoritos" && !c.favorite) return false;
        if (!q) return true;
        return c.contact.name.toLowerCase().includes(q) || c.tags.join(" ").toLowerCase().includes(q);
      })
      .sort(
        (a, b) =>
          Number(!!b.pinned) - Number(!!a.pinned) ||
          new Date(b.messages[b.messages.length - 1]?.at ?? 0).getTime() -
            new Date(a.messages[a.messages.length - 1]?.at ?? 0).getTime(),
      );
  }, [chats, filter, query]);

  // Auto-scroll al final al abrir / enviar.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeId, active?.messages.length]);

  function openChat(id: string) {
    setActiveId(id);
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }
  function toggleBot(id: string) {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, botActive: !c.botActive } : c)));
  }
  function send() {
    const text = draft.trim();
    if (!text || !active) return;
    const msg: Message = {
      id: `x-${active.messages.length + 1}-${text.length}`,
      fromMe: true,
      type: "text",
      text,
      status: "sent",
      at: new Date().toISOString(),
    };
    setChats((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, msg], botActive: false } : c)),
    );
    setDraft("");
  }

  const FILTERS: { key: Filter; label: string; count?: number }[] = [
    { key: "todos", label: "Todos" },
    { key: "no_leidos", label: "No leídos", count: counts.no_leidos },
    { key: "bot", label: "Bot activo", count: counts.bot },
    { key: "favoritos", label: "Favoritos", count: counts.favoritos },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ───────── Lista de conversaciones ───────── */}
      <aside
        className={cn(
          "w-full flex-col border-r border-border bg-surface sm:flex sm:w-[360px] sm:shrink-0",
          active ? "hidden sm:flex" : "flex",
        )}
      >
        <div className="border-b border-border px-4 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-success/15 text-success">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-base font-bold leading-none">
                Vendedor <span className="text-success">24/7</span>
              </h1>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Conversaciones de WhatsApp · IA</p>
            </div>
          </div>

          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar o empezar un chat"
              className="h-9 w-full rounded-full border border-input bg-surface-2/60 pl-9 pr-4 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  filter === f.key ? "bg-success/15 text-success" : "bg-surface-2 text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                {f.count ? (
                  <span className="rounded-full bg-success px-1.5 text-[10px] font-bold text-white">{f.count}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto">
          {list.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">No se encontraron chats.</li>
          )}
          {list.map((c) => {
            const last = c.messages[c.messages.length - 1];
            const isActive = c.id === activeId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => openChat(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-border/60 px-3 py-3 text-left transition-colors hover:bg-surface-2/60",
                    isActive && "bg-surface-2/80",
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar initials={c.contact.initials} color={c.contact.color} size={44} />
                    {c.contact.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-success" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      {c.pinned && <Pin className="h-3 w-3 shrink-0 text-muted-foreground" />}
                      <span className="truncate text-sm font-semibold">{c.contact.name}</span>
                      {c.botActive && <Bot className="h-3.5 w-3.5 shrink-0 text-success" />}
                      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                        {last ? timeShort(last.at) : ""}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                        {last?.fromMe && <span className="mr-0.5 inline-flex align-middle"><Ticks status={last.status} /></span>}
                        {last?.type === "system" ? `· ${last.text}` : last?.text}
                      </p>
                      {c.unread > 0 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-success px-1.5 text-[11px] font-bold text-white">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Badge tone={LEAD_STAGE_TONE[c.stage]}>{LEAD_STAGE_LABEL[c.stage]}</Badge>
                      <span className="text-[11px]">{TEMP_META[c.temperature].emoji}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ───────── Conversación ───────── */}
      <section className={cn("min-w-0 flex-1 flex-col", active ? "flex" : "hidden sm:flex")}>
        {active ? (
          <Conversation
            chat={active}
            draft={draft}
            setDraft={setDraft}
            onSend={send}
            onBack={() => setActiveId(null)}
            onToggleBot={() => toggleBot(active.id)}
            scrollRef={scrollRef}
          />
        ) : (
          <EmptyPane />
        )}
      </section>
    </div>
  );
}

function EmptyPane() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface-2/30 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-success/12 text-success">
        <MessageSquare className="h-8 w-8" />
      </span>
      <p className="max-w-xs text-sm text-muted-foreground">
        Elige una conversación para ver el chat. El <b className="text-foreground">Vendedor 24/7</b> atiende, cotiza y
        cierra pasajes por WhatsApp automáticamente.
      </p>
    </div>
  );
}

function Conversation({
  chat,
  draft,
  setDraft,
  onSend,
  onBack,
  onToggleBot,
  scrollRef,
}: {
  chat: Chat;
  draft: string;
  setDraft: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
  onToggleBot: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      {/* Header de la conversación */}
      <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2 sm:hidden"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Avatar initials={chat.contact.initials} color={chat.contact.color} size={40} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold leading-tight">
            <span className="truncate">{chat.contact.name}</span>
            <Badge tone={LEAD_STAGE_TONE[chat.stage]}>{LEAD_STAGE_LABEL[chat.stage]}</Badge>
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {chat.contact.phone}
            {chat.contact.presence ? ` · ${chat.contact.presence}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleBot}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            chat.botActive
              ? "bg-success/15 text-success hover:bg-success/25"
              : "bg-surface-2 text-muted-foreground hover:text-foreground",
          )}
          title={chat.botActive ? "El bot está atendiendo — pausar" : "Activar bot"}
        >
          <Bot className="h-4 w-4" />
          {chat.botActive ? "Bot activo" : "Bot en pausa"}
        </button>
      </header>

      {/* Mensajes */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto bg-[#efeae2] px-4 py-4 dark:bg-[#0b141a]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 0.5px, transparent 0.5px), radial-gradient(currentColor 0.5px, transparent 0.5px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0, 11px 11px",
          color: "rgba(120,120,120,0.06)",
        }}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-1.5">
          {chat.messages.map((m) => (
            <Bubble key={m.id} m={m} />
          ))}
        </div>
      </div>

      {/* Composer / estado del bot */}
      {chat.botActive ? (
        <div className="flex items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-success" />
            El <b className="text-foreground">Vendedor 24/7</b> está atendiendo este chat.
          </span>
          <button
            type="button"
            onClick={onToggleBot}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-110"
          >
            <Hand className="h-4 w-4" /> Intervenir
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 border-t border-border bg-surface px-3 py-2.5">
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2" aria-label="Emoji">
            <Smile className="h-5 w-5" />
          </button>
          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-2" aria-label="Adjuntar">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Escribe un mensaje"
            className="h-10 flex-1 rounded-full border border-input bg-surface-2/60 px-4 text-sm outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/25"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!draft.trim()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-success text-white transition-colors hover:brightness-110 disabled:opacity-50"
            aria-label="Enviar"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      )}
    </>
  );
}

function Bubble({ m }: { m: Message }) {
  if (m.type === "system") {
    return (
      <div className="my-1 flex justify-center">
        <span className="rounded-full bg-slate-900/10 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-white/10 dark:text-white/70">
          {m.text}
        </span>
      </div>
    );
  }
  const mine = m.fromMe;
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm sm:max-w-[68%]",
          mine
            ? "rounded-br-md bg-[#d9fdd3] text-slate-900 dark:bg-[#005c4b] dark:text-slate-50"
            : "rounded-bl-md bg-white text-slate-900 dark:bg-[#202c33] dark:text-slate-100",
        )}
      >
        {m.fromBot && mine && (
          <span className="mb-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-success">
            <Bot className="h-3 w-3" /> Vendedor 24/7
          </span>
        )}
        <p className="whitespace-pre-wrap break-words leading-snug">{m.text}</p>
        <span className={cn("mt-0.5 flex items-center justify-end gap-1 text-[10px]", mine ? "text-slate-600 dark:text-white/55" : "text-slate-400")}>
          {timeShort(m.at)}
          {mine && <Ticks status={m.status} />}
        </span>
      </div>
    </div>
  );
}
