import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { AuthUser } from '@/common/interfaces/auth-user.interface';
import { Role } from '@/common/enums/role.enum';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { RolesGuard } from '@/common/guard/roles.guard';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ResolveReportDto } from './dto/resolve-report.dto';

@Controller()
@UseGuards(JwtGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('reports')
  createReport(
    @CurrentUser() reporter: AuthUser,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.createReport(
      reporter.id,
      createReportDto,
    );
  }

  @Post('listings/:listingId/reports')
  createListingReport(
    @Param('listingId', ParseUUIDPipe) listingId: string,
    @CurrentUser() reporter: AuthUser,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.createListingReport(
      listingId,
      reporter.id,
      createReportDto,
    );
  }

  @Post('users/:userId/reports')
  createUserReport(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() reporter: AuthUser,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.createUserReport(
      userId,
      reporter.id,
      createReportDto,
    );
  }

  @Get('admin/reports')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getAllReports() {
    return this.reportsService.getAllReports();
  }

  @Patch('admin/reports/:id/resolve')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  resolveReport(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() reviewer: AuthUser,
    @Body() resolveReportDto: ResolveReportDto,
  ) {
    return this.reportsService.resolveReport(
      id,
      reviewer.id,
      resolveReportDto,
    );
  }
}