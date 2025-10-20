import * as fs from 'fs';
import * as path from 'path';
import db from './connection';

async function runMigrations() {
  console.log('Starting database migrations...');

  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  try {
    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await db.query(sql);
      console.log(`✓ Completed: ${file}`);
    }

    console.log('\n✓ All migrations completed successfully!');
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

export default runMigrations;

