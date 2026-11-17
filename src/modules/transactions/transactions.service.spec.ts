/// <reference types="node" />
import { NotFoundException } from "@nestjs/common";
import assert from "node:assert/strict";
import { test } from "node:test";
import { FindOneOptions, Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionsService } from "./transactions.service";

test("filters by transaction ID and buyer or seller ID", async () => {
    const transaction = Object.assign(new Transaction(), { id: "tx-1" });
    const repository = {
        async findOne(options: FindOneOptions<Transaction>) {
            assert.deepEqual(options.where, [
                { id: "tx-1", buyerId: "user-1" },
                { id: "tx-1", sellerId: "user-1" },
            ]);
            return transaction;
        },
    };

    const service = new TransactionsService(
        repository as unknown as Repository<Transaction>
    );

    assert.equal(
        await service.getTransactionById("tx-1", "user-1"),
        transaction,
    );
});

test("returns 404 when no transaction matches the user", async () => {
    const repository = {
        async findOne() {
            return null;
        },
    };

    const service = new TransactionsService(
        repository as unknown as Repository<Transaction>
    );

    await assert.rejects(
        () => service.getTransactionById("tx-1", "user-2"),
        NotFoundException,
    );
});