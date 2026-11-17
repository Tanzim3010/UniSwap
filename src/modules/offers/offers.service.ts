import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Offer } from "./entities/offer.entity";

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer)
        private readonly offerRepository: Repository<Offer>,
    ) { }

    getOffersByBuyerId(buyerId: string) {
        return this.offerRepository.find({
            where: { buyerId },
            order: { createdAt: "DESC" },
        });
    }
}