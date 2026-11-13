import Database = require('better-sqlite3');
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import fs = require('fs');
import path = require('path');

const DB_PATH = 'chrysalideSync.db';
const sqliteDb = new Database(DB_PATH);

sqliteDb.pragma('foreign_keys = ON');

// If the expected tables are not present (empty DB), attempt to apply the bundled drizzle SQL
try {
	const hasStudents = sqliteDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='students';").get();
	if (!hasStudents) {
		// Locate drizzle SQL migration file shipped in the repo
		const migrationsDir = path.resolve(__dirname, '../../drizzle');
		const migrationFile = path.join(migrationsDir, '0000_gifted_nighthawk.sql');

		if (fs.existsSync(migrationFile)) {
			const rawSql = fs.readFileSync(migrationFile, 'utf8');
			// Remove drizzle-specific statement-breakpoint markers which are not valid SQL
			const cleaned = rawSql.split('\n').filter(line => !line.trim().startsWith('-->')).join('\n');
			// Execute inside a transaction
			sqliteDb.exec('BEGIN;');
			sqliteDb.exec(cleaned);
			sqliteDb.exec('COMMIT;');
			console.log('Database initialized from drizzle migration:', migrationFile);
		} else {
			console.warn('Migration file not found, database schema may be missing:', migrationFile);
		}
	}
	// Ensure columns expected by current schema exist (backfill for older migration files)
	try {
		const eventColumns = sqliteDb.prepare("PRAGMA table_info('events');").all().map((r: any) => r.name);
		const ensureColumn = (name: string, sqlType: string, defaultValue: string) => {
			if (!eventColumns.includes(name)) {
				const alter = `ALTER TABLE events ADD COLUMN ${name} ${sqlType} DEFAULT ${defaultValue};`;
				sqliteDb.exec(alter);
				console.log(`Added missing column ${name} to events table`);
			}
		};

		// 'code' (text) and 'examen' (integer boolean) are used by the codebase
		ensureColumn('code', 'TEXT', "''");
		ensureColumn('examen', 'INTEGER', '0');
	} catch (err) {
		console.error('Failed to ensure events table columns:', err);
		throw err;
	}
} catch (err) {
	// If migrations fail, rethrow to surface the problem to the caller
	console.error('Failed to initialize database schema:', err);
	throw err;
}

export const db = drizzle(sqliteDb, { schema });
