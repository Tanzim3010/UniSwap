import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtGuard } from '@/common/guard/jwt.guard';
import { RolesGuard } from '@/common/guard/roles.guard';
import { AuthModule } from '@/modules/auth/auth.module';
import { Listing } from '@/modules/listings/entities/listing.entity';
import { User } from '@/modules/users/entities/user.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Listing, User]), AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService, JwtGuard, RolesGuard],
  exports: [ReportsService],
})
export class ReportsModule {}