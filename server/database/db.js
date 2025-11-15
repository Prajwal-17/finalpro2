import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same db.sqlite3 as Django backend
const dbPath = path.join(__dirname, '../../backend/db.sqlite3');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables if they don't exist
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('child', 'parent', 'teacher')),
      email TEXT,
      full_name TEXT,
      linked_accounts TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Chat logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      encrypted_messages TEXT NOT NULL,
      detected_emotion TEXT DEFAULT 'neutral' CHECK(detected_emotion IN ('negative', 'neutral', 'positive', 'concerned')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (child_id) REFERENCES chat_users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chat_logs_child_id ON chat_logs(child_id);
    CREATE INDEX IF NOT EXISTS idx_chat_logs_timestamp ON chat_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_chat_users_username ON chat_users(username);
    CREATE INDEX IF NOT EXISTS idx_chat_users_role ON chat_users(role);
  `);

  console.log('✅ Database tables initialized');
}

export default db;


