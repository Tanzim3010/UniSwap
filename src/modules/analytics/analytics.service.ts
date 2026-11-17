import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


import { User } from "../users/entities/user.entity";
import { Listing } from "../listings/entities/listing.entity";
import { Offer } from "../offers/entities/offer.entity";
import { Transaction } from "../transactions/entities/transaction.entity";
import { Report } from "../reports/entities/report.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Listing)
        private readonly listingRepository: Repository<Listing>,

        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,

        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,

        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
    ) {}

async getStatics(){
    const [
        totalUsers,
        totalListings,
        totalOffers,
        totalTransactions,
        totalReports,
        pendingReports,



    ]=await Promise.all([
        this.userRepository.count(),
        this.listingRepository.count(),
        this.offerRepository.count(),
        this.transactionRepository.count(),
        this.reportRepository.count(),
        this.reportRepository.count({
            where: {status: 'pending' as Report['status']},
        }),
    ]);
    return {
        totalUsers,
        totalListings,
        totalOffers,
        totalReports,
        totalTransactions,
        pendingReports,
};    
}
}