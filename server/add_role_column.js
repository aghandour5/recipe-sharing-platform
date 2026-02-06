const db = require('./config/db');

async function migrate() {
    try {
        console.log("Adding role column to users table...");

        // Add role column if it doesn't exist
        await db.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN 
          ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'; 
        END IF; 
      END 
      $$;
    `);

        // Set a user as admin for testing (Replace with a specific username/email if known, or just the first user)
        // For now, I'll try to find a user with username 'admin' or just pick the first one.
        // Or better, let's create a specific known admin checking logic? 
        // Let's just pick the first user and make them admin so the USER can test immediately.

        const result = await db.query("SELECT id, username FROM users ORDER BY created_at ASC LIMIT 1");
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log(`Promoting user '${user.username}' (${user.id}) to ADMIN...`);
            await db.query("UPDATE users SET role = 'admin' WHERE id = $1", [user.id]);
            console.log("Admin promoted successfully.");
        } else {
            console.log("No users found to promote. Please register a user first.");
        }

        console.log("Migration complete.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
