import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "exactlyOneReportTarget", async: false })
class ExactlyOneReportTargetConstraint
  implements ValidatorConstraintInterface
{
  validate(_value: unknown, args: ValidationArguments): boolean {
    const report = args.object as {
      listingId?: string | null;
      reportedUserId?: string | null;
    };

    return (report.listingId != null) !== (report.reportedUserId != null);
  }

  defaultMessage(): string {
    return "Exactly one of listingId or reportedUserId must be provided";
  }
}

export class CreateReportDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Validate(ExactlyOneReportTargetConstraint)
  reason!: string;

  @IsOptional()
  @IsUUID()
  listingId?: string;

  @IsOptional()
  @IsUUID()
  reportedUserId?: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsOptional()
  @IsString()
  description?: string;
}