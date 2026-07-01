import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, type JwtSignOptions } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import type { CrmUser } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "dev-crm-access-secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "dev-crm-refresh-secret";
const ACCESS_TTL = (process.env.JWT_ACCESS_TTL ?? "8h") as JwtSignOptions["expiresIn"];
const REFRESH_TTL = (process.env.JWT_REFRESH_TTL ?? "30d") as JwtSignOptions["expiresIn"];

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

/** Forma pública del usuario (sin hash) — espejo de `CrmUser` de @vialta/types. */
function toPublic(u: CrmUser) {
  return {
    id: u.id,
    name: u.name,
    initials: u.initials,
    email: u.email,
    role: u.role,
    color: u.color ?? undefined,
    active: u.active,
    twoFactorEnabled: u.twoFactorEnabled,
    lastActiveAt: u.lastActiveAt ? u.lastActiveAt.toISOString() : undefined,
  };
}

@Injectable()
export class CrmAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** Valida credenciales contra el hash bcrypt almacenado. */
  async validate(email: string, password: string): Promise<CrmUser | null> {
    const user = await this.prisma.crmUser.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !user.active || user.deletedAt) return null;
    const ok = await compare(password, user.passwordHash);
    return ok ? user : null;
  }

  /** Emite tokens y registra la actividad/auditoría del login. */
  async login(user: CrmUser) {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessOpts: JwtSignOptions = { secret: ACCESS_SECRET, expiresIn: ACCESS_TTL };
    const refreshOpts: JwtSignOptions = { secret: REFRESH_SECRET, expiresIn: REFRESH_TTL };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, accessOpts),
      this.jwt.signAsync(payload, refreshOpts),
    ]);

    await this.prisma.crmUser.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });
    await this.prisma.crmAuditEntry.create({
      data: { actor: user.name, actorInitials: user.initials, action: "login", entity: "Sesión", detail: `Inicio de sesión de ${user.email}` },
    });

    return { user: toPublic(user), accessToken, refreshToken };
  }

  /** Verifica un access token (lo usa el guard). */
  async verifyAccess(token: string): Promise<JwtPayload> {
    return this.jwt.verifyAsync<JwtPayload>(token, { secret: ACCESS_SECRET });
  }

  /** Renueva el access token a partir de un refresh válido. */
  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, { secret: REFRESH_SECRET });
    } catch {
      throw new UnauthorizedException("Refresh token inválido o expirado");
    }
    const user = await this.prisma.crmUser.findUnique({ where: { id: payload.sub } });
    if (!user || !user.active || user.deletedAt) throw new UnauthorizedException("Usuario no disponible");
    const accessOpts: JwtSignOptions = { secret: ACCESS_SECRET, expiresIn: ACCESS_TTL };
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }, accessOpts);
    return { accessToken };
  }

  /** Usuario público del token actual. */
  async me(userId: string) {
    const user = await this.prisma.crmUser.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return toPublic(user);
  }
}
