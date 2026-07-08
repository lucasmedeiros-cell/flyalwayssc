/**
 * Vendedor 24/7 — datos demo del bot vendedor por WhatsApp (adaptado de
 * easy-pay-pos · categorias/vendedor24_7, al dominio de vuelos de FlyAlways).
 * Un bot de IA atiende leads por WhatsApp, cotiza y cierra pasajes; el humano
 * puede intervenir. En producción esto vendría del backend + WhatsApp API.
 */
import type { BadgeTone } from "@vialta/ui";
import type { Quote, QuoteItem, QuoteStatus } from "@vialta/types";

/** Marca de origen para reconocer cotizaciones creadas por el bot. */
export const VENDEDOR_AGENT = "Vendedor 24/7";

export type LeadStage = "nuevo" | "contactado" | "calificado" | "cotizado" | "cerrado" | "perdido";

export const LEAD_STAGE_LABEL: Record<LeadStage, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  calificado: "Calificado",
  cotizado: "Cotizado",
  cerrado: "Cerrado",
  perdido: "Perdido",
};

export const LEAD_STAGE_TONE: Record<LeadStage, BadgeTone> = {
  nuevo: "neutral",
  contactado: "primary",
  calificado: "accent",
  cotizado: "warning",
  cerrado: "success",
  perdido: "danger",
};

export type Temperature = "caliente" | "tibio" | "frio";
export const TEMP_META: Record<Temperature, { label: string; emoji: string }> = {
  caliente: { label: "Caliente", emoji: "🔥" },
  tibio: { label: "Tibio", emoji: "🌡️" },
  frio: { label: "Frío", emoji: "❄️" },
};

export type MessageStatus = "sent" | "delivered" | "read";
export type MessageType = "text" | "image" | "system";

export interface Message {
  id: string;
  fromMe: boolean;
  fromBot?: boolean;
  type: MessageType;
  text?: string;
  mediaUrl?: string;
  status?: MessageStatus;
  at: string; // ISO
}

export interface Contact {
  name: string;
  phone: string;
  initials: string;
  color: string;
  online?: boolean;
  presence?: string;
}

export interface Chat {
  id: string;
  contact: Contact;
  stage: LeadStage;
  temperature: Temperature;
  botActive: boolean;
  unread: number;
  pinned?: boolean;
  favorite?: boolean;
  tags: string[];
  assignedTo?: string;
  messages: Message[];
}

const now = Date.now();
const min = 60_000;
const hr = 60 * min;
const day = 24 * hr;
const t = (ago: number) => new Date(now - ago).toISOString();

export const VENDEDOR_CHATS: Chat[] = [
  {
    id: "c1",
    contact: { name: "María Fernanda", phone: "+591 70011223", initials: "MF", color: "#3a23a8", online: true, presence: "en línea" },
    stage: "cotizado",
    temperature: "caliente",
    botActive: true,
    unread: 0,
    pinned: true,
    favorite: true,
    tags: ["VVI→MAD", "ida y vuelta"],
    assignedTo: "Bot",
    messages: [
      { id: "m1", fromMe: false, type: "text", text: "Hola! Quiero un vuelo de Santa Cruz a Madrid para el 15 de agosto ✈️", at: t(42 * min) },
      { id: "m2", fromMe: true, fromBot: true, type: "text", text: "¡Hola María! 👋 Soy el asistente de FlyAlways. Para Santa Cruz (VVI) → Madrid (MAD) el 15 de agosto tengo estas opciones. ¿Ida y vuelta o solo ida?", at: t(41 * min), status: "read" },
      { id: "m3", fromMe: false, type: "text", text: "Ida y vuelta, vuelvo el 30. Somos 2 personas.", at: t(39 * min) },
      { id: "m4", fromMe: true, fromBot: true, type: "text", text: "Perfecto 🙌 Mejor tarifa ida y vuelta, 2 pasajeros, Económica:\n• Air Europa · 1 escala · Bs 12.480 c/u\n• Boliviana + Iberia · 1 escala · Bs 13.900 c/u\nPrecios en bolivianos, equipaje de 23 kg incluido.", at: t(38 * min), status: "read" },
      { id: "m5", fromMe: false, type: "text", text: "Me interesa la de Air Europa 😍 ¿cómo reservo?", at: t(20 * min) },
      { id: "m6", fromMe: true, fromBot: true, type: "text", text: "¡Excelente elección! Te preparo la reserva. ¿Me confirmas nombres completos y CI/pasaporte de los 2 pasajeros para emitir?", at: t(19 * min), status: "delivered" },
    ],
  },
  {
    id: "c2",
    contact: { name: "Carlos Empresa", phone: "+591 71234567", initials: "CE", color: "#1ca71c", presence: "últ. vez hoy 13:40" },
    stage: "calificado",
    temperature: "caliente",
    botActive: false,
    unread: 2,
    favorite: true,
    tags: ["grupo", "corporativo", "VVI→LIM"],
    assignedTo: "Ana Flores",
    messages: [
      { id: "m1", fromMe: false, type: "text", text: "Buenas, necesito 5 pasajes Santa Cruz–Lima para un viaje de la empresa, ¿tarifa corporativa?", at: t(3 * hr) },
      { id: "m2", fromMe: true, fromBot: true, type: "text", text: "Hola Carlos 👋 Claro, para grupos de 5+ manejamos tarifa corporativa. ¿Fechas de ida y regreso?", at: t(2.7 * hr), status: "read" },
      { id: "m3", fromMe: false, type: "text", text: "Ida el 5 de septiembre, regreso el 9. Todos en económica.", at: t(2.5 * hr) },
      { id: "m4", fromMe: true, type: "text", text: "Carlos, soy Ana del equipo. Te armo una cotización corporativa con factura a nombre de la empresa. ¿Razón social y NIT?", at: t(2.4 * hr), status: "read" },
      { id: "m5", fromMe: false, type: "text", text: "Perfecto. Te paso los datos por acá.", at: t(2.3 * hr) },
      { id: "m6", fromMe: false, type: "text", text: "¿Aceptan pago con transferencia?", at: t(2.2 * hr) },
    ],
  },
  {
    id: "c3",
    contact: { name: "Sofía Quiroga", phone: "+591 76050403", initials: "SQ", color: "#8b7bf5", online: true, presence: "en línea" },
    stage: "contactado",
    temperature: "tibio",
    botActive: true,
    unread: 0,
    tags: ["promo Cancún"],
    assignedTo: "Bot",
    messages: [
      { id: "m1", fromMe: false, type: "text", text: "Vi la promo a Cancún en su Instagram 🏖️ ¿sigue disponible?", at: t(15 * min) },
      { id: "m2", fromMe: true, fromBot: true, type: "text", text: "¡Hola Sofía! Sí 🌴 La promo Santa Cruz → Cancún está desde Bs 6.890 ida y vuelta, para viajar en octubre. ¿Para cuántas personas y qué fechas?", at: t(14 * min), status: "delivered" },
    ],
  },
  {
    id: "c4",
    contact: { name: "Pedro Quispe", phone: "+591 72900011", initials: "PQ", color: "#e0a106", presence: "últ. vez ayer 20:10" },
    stage: "cerrado",
    temperature: "caliente",
    botActive: false,
    unread: 0,
    tags: ["FA-20421", "emitido"],
    assignedTo: "Ana Flores",
    messages: [
      { id: "m1", fromMe: false, type: "text", text: "Quiero cambiar la fecha de mi vuelo LPB–LIM al 12.", at: t(1.2 * day) },
      { id: "m2", fromMe: true, fromBot: true, type: "text", text: "Hola Pedro 😊 Tu pasaje FA-20421 permite cambio con diferencia de tarifa. Para el 12 hay disponibilidad, la diferencia es Bs 320. ¿Confirmo el cambio?", at: t(1.2 * day), status: "read" },
      { id: "m3", fromMe: false, type: "text", text: "Sí, confírmalo. Pago con QR.", at: t(1.1 * day) },
      { id: "m4", fromMe: true, type: "text", text: "Listo Pedro ✅ Cambio confirmado, te reenvío el pasaje actualizado. ¡Buen viaje! 🛫", at: t(1.1 * day), status: "read" },
      { id: "m5", fromMe: false, type: "system", text: "Venta cerrada por el Vendedor 24/7 · FA-20421 · Bs 320", at: t(1.1 * day) },
    ],
  },
  {
    id: "c5",
    contact: { name: "Lucía Antelo", phone: "+591 70588990", initials: "LA", presence: "últ. vez hoy 09:15", color: "#0ea5e9" },
    stage: "contactado",
    temperature: "tibio",
    botActive: true,
    unread: 0,
    tags: ["equipaje"],
    assignedTo: "Bot",
    messages: [
      { id: "m1", fromMe: false, type: "text", text: "Hola, ¿cuánto equipaje puedo llevar en un vuelo nacional?", at: t(5 * hr) },
      { id: "m2", fromMe: true, fromBot: true, type: "text", text: "¡Hola Lucía! En vuelos nacionales incluyes 1 maleta de 23 kg + equipaje de mano de 8 kg. ¿Te ayudo a buscar un vuelo? ✈️", at: t(5 * hr), status: "read" },
      { id: "m3", fromMe: false, type: "text", text: "Gracias! por ahora solo consultaba 🙌", at: t(4.8 * hr) },
    ],
  },
  {
    id: "c6",
    contact: { name: "Roberto Méndez", phone: "+591 73400559", initials: "RM", presence: "últ. vez hace 3 días", color: "#e62020" },
    stage: "perdido",
    temperature: "frio",
    botActive: false,
    unread: 0,
    tags: ["precio"],
    assignedTo: "Bot",
    messages: [
      { id: "m1", fromMe: false, type: "text", text: "Vi los precios a Miami, están caros para mí. Gracias igual.", at: t(3 * day) },
      { id: "m2", fromMe: true, fromBot: true, type: "text", text: "Entiendo Roberto 🙏 Te aviso apenas salga una promo a Miami. ¡Gracias por escribir a FlyAlways!", at: t(3 * day), status: "read" },
    ],
  },
];

/* ------------------------- Cotizaciones del bot ---------------------------- */
/**
 * Cotizaciones que el Vendedor 24/7 generó en las conversaciones. El módulo
 * Cotizador las incorpora a su lista (marcadas con agentName = VENDEDOR_AGENT).
 */
const CHAT_QUOTES: Record<string, Omit<QuoteItem, "id">[]> = {
  c1: [{ description: "Vuelo VVI → MAD · ida y vuelta", detail: "Air Europa · 1 escala · Económica", quantity: 2, unitPrice: 12480 }],
  c2: [{ description: "Vuelo VVI → LIM · ida y vuelta", detail: "Tarifa corporativa · Económica", quantity: 5, unitPrice: 3200 }],
  c3: [{ description: "Vuelo VVI → CUN · promo", detail: "Ida y vuelta · octubre · Económica", quantity: 1, unitPrice: 6890 }],
  c4: [{ description: "Cambio de fecha · pasaje FA-20421", detail: "LPB → LIM", quantity: 1, unitPrice: 320 }],
  c6: [{ description: "Vuelo VVI → MIA · ida y vuelta", detail: "Económica", quantity: 1, unitPrice: 15900 }],
};

const STAGE_TO_QUOTE_STATUS: Record<LeadStage, QuoteStatus> = {
  nuevo: "draft",
  contactado: "sent",
  calificado: "draft",
  cotizado: "sent",
  cerrado: "converted",
  perdido: "rejected",
};

/** Convierte las conversaciones con cotización del bot en objetos Quote. */
export function vendedorQuotes(): Quote[] {
  return VENDEDOR_CHATS.filter((c) => CHAT_QUOTES[c.id]).map((c, i) => {
    const items = CHAT_QUOTES[c.id];
    const lastAt = c.messages[c.messages.length - 1]?.at ?? new Date().toISOString();
    const validUntil = new Date(Date.parse(lastAt) + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return {
      id: `v24-${c.id}`,
      code: `FA-Q9${String(40 + i).padStart(3, "0")}`,
      customerName: c.contact.name,
      customerPhone: c.contact.phone,
      agentName: VENDEDOR_AGENT,
      items: items.map((it, j) => ({ id: `${c.id}-i${j}`, ...it })),
      currency: "BOB",
      taxPct: 0,
      validUntil,
      status: STAGE_TO_QUOTE_STATUS[c.stage],
      notes: "Generada automáticamente por el Vendedor 24/7 (WhatsApp).",
      createdAt: lastAt,
    } satisfies Quote;
  });
}
