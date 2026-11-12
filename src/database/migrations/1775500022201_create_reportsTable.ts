import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
} from "typeorm";

export class createReportsTable1775500022201
implements MigrationInterface {
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
                        name: "reported_id",//fK users
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name:"listing_id",//fk listingd
                        type: "uuid",
                        isNullable:true,
                    },
                    {
                        name: "reported_user_id",// fk users
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name: "reviewed_by",
                        type: "uuid",
                        isNullable: true,
                    },
                    {
                        name:"reason",
                        type: "varchar",
                        length:"200",
                        isNullable:false,

                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name:"moderation_note",
                        type:"text",
                        isNullable:true,

                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["pending","resolved", "dismiss","under_review"],//not sure
                        enumName:"report_status",
                        default:"'pending'",
                        isNullable:false,

                    },
                    {
                        name:"reviewed_at",
                        type:"timestamp",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },

                ],
            })
        );


              /*  foreignKeys: [
                    {
                        name: "FK_reported_id",
                        columnNames: ["reported_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        name: "FK_listing_id",
                        columnNames: ["listing_id"],
                        referencedTableName: "listings",
                        referencedColumnNames: ["id"],
                        onDelete: "SET NULL",
                    },
                    {
                        name: "FK_reported_user_id",
                        columnNames: ["reported_user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",
                    },
                    {
                        name: "FK_reviewed_by",
                        columnNames: ["reviewed_by"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "SET NULL",
                    },
                ],
            }),
           
        );

await queryRunner.createIndex(
    "reports",
    new TableIndex ({
        name:"IDX_reports_reported_id",
        columnNames:["reported_id"],
    }),
);
await queryRunner.createIndex(
    "reports",
    new TableIndex({
        name:"IDX_reports_listing_id",
        columnNames:["listing_id"],

    }),
);  
await queryRunner.createIndex(
    "reports",
    new TableIndex({
        name:"IDX_reports_reported_user_id",
        columnNames:["reported_user_id"],
    }),
);
await queryRunner.createIndex(
    "reports",
    new TableIndex({
        name:"IDX_reports_reviewed_by",
        columnNames:["reviewed_by"],
    }),
);     
    }*/
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("reports", true);
    }
}