import db from '../database/db.js';
import { encrypt, decrypt } from '../utils/encryption.js';

class ChatLog {
  static create({ childId, messages, detectedEmotion = 'neutral' }) {
    // Encrypt messages
    const messagesJson = JSON.stringify(messages);
    const encryptedMessages = encrypt(messagesJson);
    
    const stmt = db.prepare(`
      INSERT INTO chat_logs (child_id, encrypted_messages, detected_emotion)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(childId, encryptedMessages, detectedEmotion);
    return this.findById(result.lastInsertRowid);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM chat_logs WHERE id = ?');
    const log = stmt.get(id);
    return log ? this.parseLog(log) : null;
  }

  static findByChildId(childId, limit = 100) {
    const stmt = db.prepare(`
      SELECT * FROM chat_logs 
      WHERE child_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);
    const logs = stmt.all(childId, limit);
    return logs.map(log => this.parseLog(log));
  }

  static parseLog(row) {
    let messages = [];
    try {
      const decrypted = decrypt(row.encrypted_messages);
      messages = JSON.parse(decrypted);
    } catch (error) {
      console.error('Error decrypting messages:', error);
      messages = [];
    }

    return {
      id: row.id,
      childId: row.child_id,
      timestamp: row.timestamp,
      messages: messages,
      detectedEmotion: row.detected_emotion,
      createdAt: row.created_at
    };
  }

  static findDecrypted(childId, limit = 100) {
    return this.findByChildId(childId, limit);
  }
}

export default ChatLog;
