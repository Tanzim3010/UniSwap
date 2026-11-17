import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";
import { User } from "../users/entities/user.entity";
import { Listing } from "../listings/entities/listing.entity";
import { Offer } from "../offers/entities/offer.entity";
import { Transaction } from "../transactions/entities/transaction.entity";
import { Report } from "../reports/entities/report.entity";
@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, Listing,Offer,Transaction,Report]),
    ],
    controllers:[AnalyticsController],
    providers:[AnalyticsService],
    exports:[AnalyticsService],
})
export class AnalyticsModule{}