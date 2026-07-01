import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiTags } from "@nestjs/swagger";
import { CrmAuthService } from "./crm-auth.service";
import { CrmJwtGuard } from "./crm-jwt.guard";
import { LoginDto, RefreshDto } from "./dto/login.dto";

@ApiTags("crm-auth")
@Controller("crm/auth")
export class CrmAuthController {
  constructor(private readonly auth: CrmAuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validate(dto.email, dto.password);
    if (!user) throw new UnauthorizedException("Credenciales incorrectas");
    return this.auth.login(user);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @UseGuards(CrmJwtGuard)
  @Get("me")
  me(@Req() req: Request & { crmUser: { sub: string } }) {
    return this.auth.me(req.crmUser.sub);
  }
}
