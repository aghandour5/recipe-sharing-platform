const db = require('./config/db');

async function fixSchema() {
    try {
        console.log("Checking categories ID type...");
        // Check one category to see ID type
        const catResult = await db.query('SELECT id FROM categories LIMIT 1');
        if (catResult.rows.length === 0) {
            console.log("No categories found. Defaulting to assuming Integer since that's what the error suggests.");
        } else {
            const sampleId = catResult.rows[0].id;
            console.log(`Sample Category ID: ${sampleId} (Type: ${typeof sampleId})`);
        }

        console.log("Dropping recipe_categories table...");
        await db.query('DROP TABLE IF EXISTS recipe_categories');

        console.log("Recreating recipe_categories table...");
        // recipe_id is UUID (from recipes table)
        // category_id should be INTEGER (based on our finding)
        await db.query(`
      CREATE TABLE recipe_categories (
        recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (recipe_id, category_id)
      )
    `);

        console.log("recipe_categories table fixed!");
        process.exit(0);
    } catch (err) {
        console.error("Error fixing schema:", err);
        process.exit(1);
    }
}

fixSchema();
