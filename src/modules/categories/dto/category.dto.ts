import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from "class-validator";

export class CreateCategoryDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;
}

export class UpdateCategoryDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @MaxLength(120)
  slug?: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  isActive?: boolean;
}
