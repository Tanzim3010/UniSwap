import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOffersAndTransactions1794528000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "offers",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "listing_id", type: "uuid" },
          { name: "buyer_id", type: "uuid" },
          {
            name: "offered_price",
            type: "numeric",
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          { name: "message", type: "text", isNullable: true },
          {
            name: "status",
            type: "enum",
            enumName: "offer_status",
            enum: ["pending", "accepted", "rejected"],
            default: "'pending'",
          },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "updated_at", type: "timestamptz", default: "now()" },
        ],
        foreignKeys: [
          {
            columnNames: ["listing_id"],
            referencedTableName: "listings",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            columnNames: ["buyer_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: "transactions",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          { name: "listing_id", type: "uuid" },
          { name: "offer_id", type: "uuid" },
          { name: "buyer_id", type: "uuid" },
          { name: "seller_id", type: "uuid" },
          {
            name: "status",
            type: "enum",
            enumName: "transaction_status",
            enum: ["reserved", "completed", "cancelled"],
            default: "'reserved'",
          },
          { name: "completed_at", type: "timestamptz", isNullable: true },
          { name: "cancelled_at", type: "timestamptz", isNullable: true },
          { name: "created_at", type: "timestamptz", default: "now()" },
          { name: "updated_at", type: "timestamptz", default: "now()" },
        ],
        foreignKeys: [
          {
            columnNames: ["listing_id"],
            referencedTableName: "listings",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            columnNames: ["offer_id"],
            referencedTableName: "offers",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            columnNames: ["buyer_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            columnNames: ["seller_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
        ],
        uniques: [
          {
            name: queryRunner.connection.namingStrategy.relationConstraintName(
              "transactions",
              ["offer_id"],
            ),
            columnNames: ["offer_id"],
          },
        ],
        checks: [
          {
            name: "ck_transactions_buyer_not_seller",
            expression: `"buyer_id" <> "seller_id"`,
          },
        ],
      }),
    );

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_offers_one_pending_per_buyer_listing"
      ON "offers" ("listing_id", "buyer_id") WHERE "status" = 'pending'
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_transactions_one_reserved_per_listing"
      ON "transactions" ("listing_id") WHERE "status" = 'reserved'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("transactions");
    await queryRunner.dropTable("offers");
    await queryRunner.query('DROP TYPE "transaction_status"');
    await queryRunner.query('DROP TYPE "offer_status"');
  }
}
