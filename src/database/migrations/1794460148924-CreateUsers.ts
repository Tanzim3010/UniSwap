import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1794460148924 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                      name: "id",
                      type: "uuid",
                      isPrimary: true,
                      generationStrategy: "uuid",
                      default: "uuid_generate_v4()",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "password_hash",
                        type: "varchar",
                        isNullable: false,  
                    },
                    {
                        name: "display_name",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["USER", "ADMIN"],
                        default: "'USER'",
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["PENDING", "ACTIVE", "SUSPENDED"],
                        default: "'PENDING'",
                    },
                    {
                        name: "is_verified",
                        type: "boolean",
                        default: false, 
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
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users', true);

        await queryRunner.query(
            'DROP TYPE IF EXISTS "user_status_enum"',
    );

        await queryRunner.query(
            'DROP TYPE IF EXISTS "user_role_enum"',
    );
  }

}
