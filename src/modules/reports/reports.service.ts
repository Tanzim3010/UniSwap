import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Listing } from '@/modules/listings/entities/listing.entity';
import { User } from '@/modules/users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ResolveReportDto } from './dto/resolve-report.dto';
import { Report, ReportStatus } from './entities/report.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createReport(
    reporterId: string,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    const listingId = createReportDto.listingId ?? undefined;
    const reportedUserId = createReportDto.reportedUserId ?? undefined;

    if (listingId !== undefined && reportedUserId === undefined) {
      return this.createListingReport(
        listingId,
        reporterId,
        createReportDto,
      );
    }

    if (reportedUserId !== undefined && listingId === undefined) {
      return this.createUserReport(
        reportedUserId,
        reporterId,
        createReportDto,
      );
    }

    throw new BadRequestException(
      'Exactly one of listingId or reportedUserId must be provided',
    );
  }

  async createListingReport(
    listingId: string,
    reporterId: string,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    const [listing, reporter] = await Promise.all([
      this.listingRepository.findOne({ where: { id: listingId } }),
      this.userRepository.findOne({ where: { id: reporterId } }),
    ]);

    if (!listing) {
      throw new NotFoundException(`Listing ${listingId} not found`);
    }

    if (!reporter) {
      throw new NotFoundException(`Reporter ${reporterId} not found`);
    }

    const report = this.reportRepository.create({
      reporter: { id: reporter.id },
      listing: { id: listing.id },
      reported_user: null,
      reason: createReportDto.reason,
      description: createReportDto.description ?? null,
      status: ReportStatus.PENDING,
    });

    return this.reportRepository.save(report);
  }

  async createUserReport(
    userId: string,
    reporterId: string,
    createReportDto: CreateReportDto,
  ): Promise<Report> {
    if (userId === reporterId) {
      throw new BadRequestException('You cannot report yourself');
    }

    const [reportedUser, reporter] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId } }),
      this.userRepository.findOne({ where: { id: reporterId } }),
    ]);

    if (!reportedUser) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (!reporter) {
      throw new NotFoundException(`Reporter ${reporterId} not found`);
    }

    const report = this.reportRepository.create({
      reporter: { id: reporter.id },
      listing: null,
      reported_user: { id: reportedUser.id },
      reason: createReportDto.reason,
      description: createReportDto.description ?? null,
      status: ReportStatus.PENDING,
    });

    return this.reportRepository.save(report);
  }

  async getAllReports(): Promise<Report[]> {
    return this.reportRepository.find({
      relations: {
        reporter: true,
        listing: true,
        reported_user: true,
        reviewer: true,
      },
      order: { created_at: 'DESC' },
    });
  }

  async resolveReport(
    id: string,
    reviewerId: string,
    resolveReportDto: ResolveReportDto,
  ): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Report ${id} not found`);
    }

    const reviewer = await this.userRepository.findOne({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      throw new NotFoundException(`Reviewer ${reviewerId} not found`);
    }

    report.status = resolveReportDto.status;
    report.reviewer = this.userRepository.create({ id: reviewer.id });
    report.reviewed_at = new Date();

    if (resolveReportDto.moderation_note !== undefined) {
      report.moderation_note = resolveReportDto.moderation_note;
    }

    return this.reportRepository.save(report);
  }
}
