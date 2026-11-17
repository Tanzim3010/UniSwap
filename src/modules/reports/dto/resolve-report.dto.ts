import { IsEnum, IsOptional, IsString } from "class-validator";

export enum ReportStatus {
  REVIEWED = "reviewed",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}

export class ResolveReportDto {
  @IsEnum(ReportStatus)
  status!: ReportStatus;

  @IsOptional()
  @IsString()
  moderation_note?:string;
}
