import { describe, expect, it, jest } from "@jest/globals";
import { NotFoundException } from "@nestjs/common";
import { FindOneOptions, Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionsService } from "./transactions.service";

describe("TransactionsService", () => {
    it("filters by transaction ID and buyer or seller ID", async () => {
        const transaction = Object.assign(new Transaction(), { id: "tx-1" });
        const findOne = jest.fn(
            async (options: FindOneOptions<Transaction>) => {
                expect(options.where).toEqual([
                    { id: "tx-1", buyerId: "user-1" },
                    { id: "tx-1", sellerId: "user-1" },
                ]);
                return transaction;
            },
        );
        const repository = { findOne };

        const service = new TransactionsService(
            repository as unknown as Repository<Transaction>,
        );

        await expect(
            service.getTransactionById("tx-1", "user-1"),
        ).resolves.toBe(transaction);
    });

    it("returns 404 when no transaction matches the user", async () => {
        const repository = {
            findOne: jest.fn().mockResolvedValue(null),
        };

        const service = new TransactionsService(
            repository as unknown as Repository<Transaction>,
        );

        await expect(
            service.getTransactionById("tx-1", "user-2"),
        ).rejects.toBeInstanceOf(NotFoundException);
    });
});