import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateReportsTable1775500022201 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: "reports",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default:"uuid_generate_v4()"
                    },
                    {
                        name:"reporter_id",
                        type:"uuid",
                    },
                    {
                        name:"listing_id",
                        type:"uuid",
                        isNullable:true,
                    },
                    {
                        name:"reported_user_id",
                        type:"uuid",
                        isNullable:true,
                    },
                    {
                        name:"reason",
                        type:"varchar",
                        isNullable:false,
                    },
                    {
                        name:"description",
                        type:"text",
                        isNullable:true,
                    },
                    {
                        name:"status",
                        type:"enum",
                        enum: ["pending", "reviewed", "resolved", "rejected"],
                        default:"pending",

                    },
                    {
                        name: "reviewed_by",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name:"moderation_note",
                        type:"text",
                        isNullable:true,
                    },
                    {
                        name:"reviewed_at",
                        type:"timestamp",
                        default: "CURRENT_TIMESTAMP",

                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    
                ],
                foreignKeys:[
                    {
                        name:"FK_reports_reporter",
                        columnNames:["reporter_id"],
                        referencedTableName:"users",
                        referencedColumnNames:["id"],
                        onDelete:"CASCADE",

                    },
                    {
                        name:"FK_reports_listing",
                        columnNames:["listing_id"],
                        referencedTableName:"listings",
                        referencedColumnNames:["id"],
                        onDelete:"CASCADE", 
                    },
                    {
                        name:"FK_reports_reported_user",
                        columnNames:["reported_user_id"],
                        referencedTableName:"users",
                        referencedColumnNames:["id"],
                        onDelete:"CASCADE", 
                    },
                    {
                        name:"FK_reports_reviewer",
                        columnNames:["reviewed_by"],
                        referencedTableName:"users",
                        referencedColumnNames:["id"],
                        onDelete:"SET NULL", 
                    },
                ],
                checks:[
                    {
                        name: "CHK_reports_target",
                        expression: `num_nonnulls("listing_id", "reported_user_id") = 1`,
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("reports");
    }
}