// reports.service.ts

import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ResolveReportDto } from './dto/resolve-report.dto';

@Injectable()
export class ReportsService {
  async createListingReport(
    listingId: string,
    reporterId: string,
    createReportDto: CreateReportDto,
  ) {
    // TODO: Validate the listing and save the report.
  }

  async createUserReport(
    userId: string,
    reporterId: string,
    createReportDto: CreateReportDto,
  ) {
    // TODO: Validate the reported user and save the report.
  }

  async getAllReports() {
    // TODO: Retrieve reports with pagination.
  }

  async resolveReport(
    id: string,
    reviewerId: string,
    resolveReportDto: ResolveReportDto,
  ) {
    // TODO: Find report and update its status.
    // Set reviewerId and reviewed_at.
  }
}