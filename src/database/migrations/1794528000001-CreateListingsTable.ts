import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateListingsTable1794528000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "listings",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "title",
            type: "varchar",
            length: "160",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "price",
            type: "double precision",
            isNullable: true,
          },
          {
            name: "condition",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "status",
            type: "varchar",
            length: "20",
            default: "'ACTIVE'",
            isNullable: false,
          },
          {
            name: "image_urls",
            type: "text",
            isArray: true,
            default: "'{}'",
            isNullable: false,
          },
          {
            name: "location",
            type: "varchar",
            length: "160",
            isNullable: true,
          },
          {
            name: "category_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "seller_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "deleted_at",
            type: "timestamptz",
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["category_id"],
            referencedTableName: "categories",
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
        indices: [
          {
            name: "idx_listings_category_status",
            columnNames: ["category_id", "status"],
          },
          {
            name: "idx_listings_seller",
            columnNames: ["seller_id"],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("listings");
  }
}
