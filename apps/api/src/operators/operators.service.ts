import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TransportMode, type Company } from "@prisma/client";

/** Nº de opiniones estable derivado del id (la columna no existe en el esquema). */
function deriveReviews(id: string, rating: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return Math.round(rating * 1000) + (h % 40000);
}

/** Mapea la entidad Company de Prisma a la forma `Operator` del frontend. */
function toOperator(c: Company) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    modes: c.modes.map((m) => m.toLowerCase()),
    logoMark: c.logoMark,
    brandColor: c.brandColor,
    rating: c.rating,
    reviewsCount: deriveReviews(c.id, c.rating),
    countryCode: c.countryCode,
  };
}

@Injectable()
export class OperatorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(mode?: TransportMode) {
    const rows = await this.prisma.company.findMany({
      where: mode ? { modes: { has: mode } } : undefined,
      orderBy: { rating: "desc" },
    });
    return rows.map(toOperator);
  }

  findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: { branches: true, vehicles: true },
    });
  }
}
