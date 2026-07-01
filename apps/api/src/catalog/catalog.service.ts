import { Injectable } from "@nestjs/common";
import { Prisma, TransportMode } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

/** Mapea el `kind` (string en DB) al literal del frontend. */
type WebPlace = {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  kind: string;
  geo?: { lat: number; lng: number };
};

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listPlaces(mode?: TransportMode, query?: string): Promise<WebPlace[]> {
    const where: Prisma.PlaceWhereInput = {};
    // La plataforma opera vuelos: para AIR devolvemos aeropuertos.
    if (mode === "AIR") where.kind = "airport";
    if (query?.trim()) {
      const q = query.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { code: { contains: q, mode: "insensitive" } },
      ];
    }
    const rows = await this.prisma.place.findMany({ where, orderBy: { city: "asc" } });
    return rows.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      city: p.city,
      country: p.country,
      countryCode: p.countryCode,
      kind: p.kind,
      geo: p.lat != null && p.lng != null ? { lat: p.lat, lng: p.lng } : undefined,
    }));
  }
}
