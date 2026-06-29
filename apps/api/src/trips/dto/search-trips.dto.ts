import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { TransportMode } from "@prisma/client";

export class SearchTripsDto {
  @ApiProperty({ enum: TransportMode })
  @IsEnum(TransportMode)
  mode!: TransportMode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destinationId?: string;

  @ApiPropertyOptional({ description: "Fecha de salida (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  departDate?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adults?: number = 1;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
