import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SearchTripsDto } from "./dto/search-trips.dto";

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(dto: SearchTripsDto) {
    const page = dto.page ?? 1;
    const pageSize = dto.pageSize ?? 20;

    const where = {
      mode: dto.mode,
      ...(dto.originId || dto.destinationId
        ? {
            route: {
              ...(dto.originId ? { originId: dto.originId } : {}),
              ...(dto.destinationId ? { destinationId: dto.destinationId } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.trip.findMany({
        where,
        include: { company: true, route: { include: { origin: true, destination: true } } },
        orderBy: { departAt: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.trip.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  findOne(id: string) {
    return this.prisma.trip.findUnique({
      where: { id },
      include: {
        company: true,
        route: { include: { origin: true, destination: true } },
        seats: true,
      },
    });
  }
}
