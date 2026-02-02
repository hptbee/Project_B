const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_FILE = path.join(__dirname, '../../api/TheCoffeeCream DB.xlsx');
const OUTPUT_FILE = path.join(__dirname, '../../api/init_db.sql');

// Map Excel types to PostgreSQL types
function inferSqlType(value) {
    if (typeof value === 'number') {
        return Number.isInteger(value) ? 'INTEGER' : 'DECIMAL(18,2)';
    }
    if (value instanceof Date) {
        return 'TIMESTAMP WITH TIME ZONE';
    }
    if (typeof value === 'boolean') {
        return 'BOOLEAN';
    }
    // Default to string
    return 'TEXT';
}

function escapeSqlString(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'number') return str;
    if (typeof str === 'boolean') return str ? 'TRUE' : 'FALSE';
    if (str instanceof Date) return `'${str.toISOString()}'`;

    // Remove null bytes and escape single quotes
    return `'${String(str).replace(/'/g, "''")}'`;
}

function main() {
    console.log(`Reading file: ${INPUT_FILE}`);

    if (!fs.existsSync(INPUT_FILE)) {
        console.error('Error: Input file not found!');
        return;
    }

    const workbook = XLSX.readFile(INPUT_FILE, { cellDates: true });
    let sqlScript = '-- Auto-generated SQL script from Excel for PostgreSQL\n\n';

    workbook.SheetNames.forEach(sheetName => {
        // Skip hidden sheets or temporary ones if needed
        console.log(`Processing sheet: ${sheetName}`);

        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

        if (data.length < 2) {
            console.warn(`Skipping sheet ${sheetName} (empty or no data)`);
            return;
        }

        const headers = data[0];
        let rows = data.slice(1);

        // Filter out empty rows (where first column is null/undefined/empty string)
        rows = rows.filter(row => row[0] !== null && row[0] !== undefined && row[0] !== '');

        // Infer column types based on the first non-null row
        const columnTypes = headers.map((header, index) => {
            // Force Id to TEXT
            if (header.trim() === 'Id') return 'TEXT';

            // Find first non-null value for this column
            const sampleRow = rows.find(row => row[index] !== null && row[index] !== undefined && row[index] !== '');
            return sampleRow ? inferSqlType(sampleRow[index]) : 'TEXT';
        });

        // 1. Generate CREATE TABLE
        // Sanitize table name (Postgres uses double quotes for case sensitivity if needed, but usually strictly mapped)
        const tableName = `"${sheetName.trim()}"`;

        sqlScript += `-- Table: ${sheetName}\n`;
        sqlScript += `DROP TABLE IF EXISTS ${tableName};\n`;
        sqlScript += `CREATE TABLE ${tableName} (\n`;

        const colDefs = headers.map((header, i) => {
            let colName = `"${header.trim()}"`;

            // Fix Typos and Mappings
            if (header.trim() === 'IsToping') colName = '"IsTopping"';
            if (header.trim() === 'Topping') colName = '"ToppingMapping"';

            let colType = columnTypes[i];

            // Force Boolean for known flags
            if (['IsActive', 'IsToping', 'IsTopping'].includes(header.trim())) {
                colType = 'BOOLEAN';
            }

            return `    ${colName} ${colType}`;
        }).join(',\n');

        sqlScript += colDefs;
        sqlScript += '\n);\n\n';

        // 2. Generate INSERT statements
        if (rows.length > 0) {
            // Fix header names in INSERT too
            const insertHeaders = headers.map(h => {
                const trimmed = h.trim();
                if (trimmed === 'IsToping') return '"IsTopping"';
                if (trimmed === 'Topping') return '"ToppingMapping"';
                return `"${trimmed}"`;
            }).join(', ');

            sqlScript += `INSERT INTO ${tableName} (${insertHeaders})\nVALUES\n`;

            const values = rows.map(row => {
                const rowValues = headers.map((header, i) => {
                    let val = row[i];
                    const trimmedHeader = header.trim();

                    // If column is Id, ensure strictly quoted string even if number
                    if (trimmedHeader === 'Id') {
                        return `'${val}'`;
                    }

                    // Force boolean conversion for known flags
                    if (['IsActive', 'IsToping', 'IsTopping'].includes(trimmedHeader)) {
                        if (val === 1 || val === '1' || val === true) return 'TRUE';
                        return 'FALSE'; // Default to FALSE for 0, null, etc.
                    }

                    return escapeSqlString(val);
                });
                return `(${rowValues.join(', ')})`;
            }).join(',\n');

            sqlScript += values + ';\n\n';
        }
    });

    // 3. Add Relationships (Foreign Keys)
    sqlScript += '-- Relationships\n';

    // Helper to add FK safely check if table exists (though we just created them)
    // Product -> Category
    sqlScript += `
    DO $$ 
    BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Product') 
           AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category') THEN
            ALTER TABLE "Product" 
            ADD CONSTRAINT fk_product_category 
            FOREIGN KEY ("CategoryId") 
            REFERENCES "Category" ("Id");
        END IF;
    END $$;
    `;

    // OrderItem -> Order
    sqlScript += `
    DO $$ 
    BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'OrderItem') 
           AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Order') THEN
            ALTER TABLE "OrderItem" 
            ADD CONSTRAINT fk_orderitem_order 
            FOREIGN KEY ("OrderId") 
            REFERENCES "Order" ("Id");
        END IF;
    END $$;
    `;

    // OrderItem -> Product
    sqlScript += `
    DO $$ 
    BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'OrderItem') 
           AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Product') THEN
            ALTER TABLE "OrderItem" 
            ADD CONSTRAINT fk_orderitem_product 
            FOREIGN KEY ("ProductId") 
            REFERENCES "Product" ("Id");
        END IF;
    END $$;
    `;

    console.log(`Writing SQL to: ${OUTPUT_FILE}`);
    fs.writeFileSync(OUTPUT_FILE, sqlScript);
    console.log('Done!');
}

main();
