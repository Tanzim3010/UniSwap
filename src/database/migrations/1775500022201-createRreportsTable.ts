import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableCheck,
  TableIndex,
} from "typeorm";

export class createReportsTable1775500022201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "reports",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "gen_random_uuid()",
          },
          {
            name: "reporter_id",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "listing_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "reported_user_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "reason",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "status",
            type: "enum",
            enum: ["pending", "reviewed", "resolved", "rejected"],
            enumName: "report_status",
            default: "'pending'",
            isNullable: false,
          },
          {
            name: "reviewed_by",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "moderation_note",
            type: "text",
            isNullable: true,
          },
          {
            name: "reviewed_at",
            type: "timestamptz",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamptz",
            default: "now()",
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: "FK_reports_reporter",
            columnNames: ["reporter_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            name: "FK_reports_listing",
            columnNames: ["listing_id"],
            referencedTableName: "listings",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            name: "FK_reports_reported_user",
            columnNames: ["reported_user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "RESTRICT",
          },
          {
            name: "FK_reports_reviewer",
            columnNames: ["reviewed_by"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "SET NULL",
          },
        ],
        checks: [
          new TableCheck({
            name: "CHK_reports_exactly_one_target",
            expression: "num_nonnulls(listing_id, reported_user_id) = 1",
          }),
        ],
        indices: [
          new TableIndex({
            name: "IDX_reports_reporter_id",
            columnNames: ["reporter_id"],
          }),
          new TableIndex({
            name: "IDX_reports_listing_id",
            columnNames: ["listing_id"],
          }),
          new TableIndex({
            name: "IDX_reports_reported_user_id",
            columnNames: ["reported_user_id"],
          }),
          new TableIndex({
            name: "IDX_reports_reviewed_by",
            columnNames: ["reviewed_by"],
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("reports", true);
    await queryRunner.query('DROP TYPE IF EXISTS "report_status"');
  }
}
