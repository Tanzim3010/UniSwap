import { IsOptional, IsString, IsUUID, Min, ValidateBy } from "class-validator";

export class CreateOfferDto {
  @IsUUID()
  listingId!: string;

  @IsOptional()
  @Min(0.01)
  @ValidateBy({
    name: "isOfferPrice",
    validator: {
      validate: (value: unknown) =>
        typeof value === "number" &&
        /^\d{1,8}(?:\.\d{1,2})?$/.test(String(value)),
      defaultMessage: () =>
        "offeredPrice must have up to 8 digits before and 2 after the decimal point",
    },
  })
  offeredPrice?: number | null;

  @IsOptional()
  @IsString()
  message?: string | null;
}
