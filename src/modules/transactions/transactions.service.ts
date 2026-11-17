import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class TransactionsService {

    async getTransactionById(id: string, userId: string) {
        const transaction = await this.transactionRepository.findOne({
            where: [
                { id, buyerId: userId },
                { id, sellerId: userId },
            ],
        });

        if (!transaction) {
            throw new NotFoundException("Transaction not found");
        }

        return transaction;
    }
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    getTransactionsByUserId(userId: string) {
        return this.transactionRepository.find({
            where: [{ buyerId: userId }, { sellerId: userId }],
            order: { createdAt: "DESC" },
        });
    }
}