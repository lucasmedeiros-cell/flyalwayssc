import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger";
import { TransportMode } from "@prisma/client";
import { TRANSPORT_MODES } from "./catalog.constants";
import { CatalogService } from "./catalog.service";

@ApiTags("catalog")
@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get("modes")
  modes() {
    return TRANSPORT_MODES;
  }

  @Get("places")
  @ApiQuery({ name: "mode", required: false, enum: TransportMode })
  @ApiQuery({ name: "q", required: false })
  places(@Query("mode") mode?: TransportMode, @Query("q") q?: string) {
    return this.catalog.listPlaces(mode, q);
  }
}
