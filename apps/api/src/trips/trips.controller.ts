import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TripsService } from "./trips.service";
import { SearchTripsDto } from "./dto/search-trips.dto";

@ApiTags("trips")
@Controller("trips")
export class TripsController {
  constructor(private readonly trips: TripsService) {}

  @Get("search")
  search(@Query() dto: SearchTripsDto) {
    return this.trips.search(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.trips.findOne(id);
  }
}
