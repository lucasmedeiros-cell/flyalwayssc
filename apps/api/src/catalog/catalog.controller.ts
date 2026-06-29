import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TRANSPORT_MODES } from "./catalog.constants";

@ApiTags("catalog")
@Controller("catalog")
export class CatalogController {
  @Get("modes")
  modes() {
    return TRANSPORT_MODES;
  }
}
