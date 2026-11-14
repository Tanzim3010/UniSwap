import { Transform, Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

import {
  ListingCondition,
  ListingStatus,
} from "@/modules/listings/entities/listing.entity";

export class CreateListingDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  description!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  price!: number;

  @IsEnum(ListingCondition)
  condition!: ListingCondition;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl(
    { protocols: ["http", "https"], require_protocol: true },
    { each: true },
  )
  imageUrls?: string[];

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(160)
  location?: string | null;
}

export class UpdateListingDto {
  @ValidateIf((_object, value) => value !== undefined)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  title?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  description?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999999.99)
  price?: number;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @ValidateIf((_object, value) => value !== undefined)
  @IsUUID()
  categoryId?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(10)
  @IsUrl(
    { protocols: ["http", "https"], require_protocol: true },
    { each: true },
  )
  imageUrls?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(160)
  location?: string | null;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEnum(ListingStatus)
  status?: ListingStatus;
}
