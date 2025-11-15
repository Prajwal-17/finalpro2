import db from '../database/db.js';
import bcrypt from 'bcryptjs';

class User {
  static create({ username, password, role, email, fullName, linkedAccountIds = [] }) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const linkedAccounts = JSON.stringify(linkedAccountIds);
    
    const stmt = db.prepare(`
      INSERT INTO chat_users (username, password, role, email, full_name, linked_accounts)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(username, hashedPassword, role, email, fullName, linkedAccounts);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM chat_users WHERE id = ?');
    const user = stmt.get(id);
    return user ? this.parseUser(user) : null;
  }

  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM chat_users WHERE username = ?');
    const user = stmt.get(username);
    return user ? this.parseUser(user) : null;
  }

  static parseUser(row) {
    return {
      _id: row.id,
      id: row.id,
      username: row.username,
      password: row.password,
      role: row.role,
      email: row.email,
      fullName: row.full_name,
      linkedAccounts: JSON.parse(row.linked_accounts || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  static comparePassword(hashedPassword, candidatePassword) {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
  }

  static updateLinkedAccounts(userId, linkedAccountIds) {
    const linkedAccounts = JSON.stringify(linkedAccountIds);
    const stmt = db.prepare('UPDATE chat_users SET linked_accounts = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(linkedAccounts, userId);
    return this.findById(userId);
  }

  static findAllByRole(role) {
    const stmt = db.prepare('SELECT * FROM chat_users WHERE role = ?');
    const users = stmt.all(role);
    return users.map(user => this.parseUser(user));
  }

  static findLinkedUsers(userId) {
    const user = this.findById(userId);
    if (!user || !user.linkedAccounts || user.linkedAccounts.length === 0) {
      return [];
    }
    
    const placeholders = user.linkedAccounts.map(() => '?').join(',');
    const stmt = db.prepare(`SELECT * FROM chat_users WHERE id IN (${placeholders})`);
    const users = stmt.all(...user.linkedAccounts);
    return users.map(u => this.parseUser(u));
  }
}

export default User;
