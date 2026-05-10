import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PATH = path.resolve(__dirname, '../../data/tracker.db');

export function cleanupByTitlePattern(pattern: string): void {
  const db = new Database(DB_PATH);
  db.prepare('DELETE FROM applications WHERE title LIKE ?').run(`%${pattern}%`);
  db.close();
}
