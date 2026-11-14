import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export enum ListingSort {
  NEWEST = "newest",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
}

export class ListListingsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(ListingSort)
  sort: ListingSort = ListingSort.NEWEST;
}
