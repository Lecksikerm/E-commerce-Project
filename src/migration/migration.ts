import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class FixProductColumns1695210000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");

        // 1. Add 'name' column as nullable first
        if (!table!.findColumnByName("name")) {
            await queryRunner.addColumn(
                "products",
                new TableColumn({
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                })
            );
        }

        // 2. Add other columns if they don't exist
        const columnsToAdd = [
            new TableColumn({ name: "price", type: "numeric", precision: 10, scale: 2, isNullable: true, default: 0 }),
            new TableColumn({ name: "stock", type: "integer", isNullable: true, default: 0 }),
            new TableColumn({ name: "img", type: "text", isNullable: true }),
            new TableColumn({ name: "createdBy", type: "uuid", isNullable: true }),
            new TableColumn({ name: "categoryId", type: "uuid", isNullable: true }),
        ];

        for (const col of columnsToAdd) {
            if (!table!.findColumnByName(col.name)) {
                await queryRunner.addColumn("products", col);
            }
        }

        // 3. Fill default values for existing rows
        await queryRunner.query(`UPDATE "products" SET "name" = 'Unnamed Product' WHERE "name" IS NULL`);
        await queryRunner.query(`UPDATE "products" SET "price" = 0 WHERE "price" IS NULL`);
        await queryRunner.query(`UPDATE "products" SET "stock" = 0 WHERE "stock" IS NULL`);

        // 4. Make columns NOT NULL
        await queryRunner.query(`UPDATE products SET name = 'Unnamed Product' WHERE name IS NULL`);
        await queryRunner.changeColumn(
            "products",
            "name",
            new TableColumn({
                name: "name",
                type: "varchar",
                length: "255",
                isNullable: false,
                default: `'Unnamed Product'`,
            })
        );

        await queryRunner.changeColumn("products", "price", new TableColumn({
            name: "price",
            type: "numeric",
            precision: 10,
            scale: 2,
            isNullable: false,
            default: 0,
        }));

        await queryRunner.changeColumn("products", "stock", new TableColumn({
            name: "stock",
            type: "integer",
            isNullable: false,
            default: 0,
        }));

        // 5. Add foreign key for createdBy
        const hasCreatedByFK = table!.foreignKeys.find(fk => fk.columnNames.indexOf("createdBy") !== -1);
        if (!hasCreatedByFK) {
            await queryRunner.createForeignKey("products", new TableForeignKey({
                columnNames: ["createdBy"],
                referencedColumnNames: ["id"],
                referencedTableName: "admin",
                onDelete: "NO ACTION",
                onUpdate: "NO ACTION",
            }));
        }

        // 6. Add foreign key for categoryId
        const hasCategoryFK = table!.foreignKeys.find(fk => fk.columnNames.indexOf("categoryId") !== -1);
        if (!hasCategoryFK) {
            await queryRunner.createForeignKey("products", new TableForeignKey({
                columnNames: ["categoryId"],
                referencedColumnNames: ["id"],
                referencedTableName: "categories",
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");

        // Drop foreign keys if exist
        const createdByFK = table!.foreignKeys.find(fk => fk.columnNames.indexOf("createdBy") !== -1);
        if (createdByFK) await queryRunner.dropForeignKey("products", createdByFK);

        const categoryFK = table!.foreignKeys.find(fk => fk.columnNames.indexOf("categoryId") !== -1);
        if (categoryFK) await queryRunner.dropForeignKey("products", categoryFK);

        // Drop added columns
        const columnsToDrop = ["categoryId", "createdBy", "img", "stock", "price", "name"];
        for (const colName of columnsToDrop) {
            if (table!.findColumnByName(colName)) {
                await queryRunner.dropColumn("products", colName);
            }
        }
    }
}
