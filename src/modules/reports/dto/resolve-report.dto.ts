import { IsIn, IsOptional, IsString } from "class-validator";
import { ReportStatus } from "../entities/report.entity";

export class ResolveReportDto {
  @IsIn([
    ReportStatus.REVIEWED,
    ReportStatus.RESOLVED,
    ReportStatus.REJECTED,
  ])
  status!: ReportStatus;

  @IsOptional()
  @IsString()
  moderation_note?: string;
}
