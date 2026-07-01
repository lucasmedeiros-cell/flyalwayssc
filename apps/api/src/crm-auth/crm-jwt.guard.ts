import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { CrmAuthService } from "./crm-auth.service";

/** Protege rutas del CRM exigiendo un access JWT válido en `Authorization: Bearer`. */
@Injectable()
export class CrmJwtGuard implements CanActivate {
  constructor(private readonly auth: CrmAuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { crmUser?: unknown }>();
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedException("Falta el token de autorización");
    }
    try {
      req.crmUser = await this.auth.verifyAccess(header.slice(7));
    } catch {
      throw new UnauthorizedException("Token inválido o expirado");
    }
    return true;
  }
}
