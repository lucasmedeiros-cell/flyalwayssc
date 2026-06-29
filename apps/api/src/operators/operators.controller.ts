import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger";
import { TransportMode } from "@prisma/client";
import { OperatorsService } from "./operators.service";

@ApiTags("operators")
@Controller("operators")
export class OperatorsController {
  constructor(private readonly operators: OperatorsService) {}

  @Get()
  @ApiQuery({ name: "mode", required: false, enum: TransportMode })
  findAll(@Query("mode") mode?: TransportMode) {
    return this.operators.findAll(mode);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.operators.findOne(id);
  }
}
