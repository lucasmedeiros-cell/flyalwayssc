import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TransportMode } from "@prisma/client";

@Injectable()
export class OperatorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(mode?: TransportMode) {
    return this.prisma.company.findMany({
      where: mode ? { modes: { has: mode } } : undefined,
      orderBy: { rating: "desc" },
    });
  }

  findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: { branches: true, vehicles: true },
    });
  }
}
