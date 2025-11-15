import User from '../models/User.model.js';
import { initializeDatabase } from '../database/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
import { config } from 'dotenv';
config({ path: join(__dirname, '../.env') });

function linkAccounts() {
  try {
    initializeDatabase();
    console.log('✅ Database initialized');
    
    // Get command line arguments
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log('Usage: node linkAccounts.js <childUsername> <parentUsername>');
      console.log('Example: node linkAccounts.js child1 parent1');
      process.exit(1);
    }
    
    const [childUsername, parentUsername] = args;
    
    const child = User.findByUsername(childUsername);
    const parent = User.findByUsername(parentUsername);
    
    if (!child) {
      console.error(`❌ Child user "${childUsername}" not found`);
      process.exit(1);
    }
    
    if (!parent) {
      console.error(`❌ Parent user "${parentUsername}" not found`);
      process.exit(1);
    }
    
    if (child.role !== 'child') {
      console.error(`❌ "${childUsername}" is not a child user`);
      process.exit(1);
    }
    
    if (parent.role !== 'parent' && parent.role !== 'teacher') {
      console.error(`❌ "${parentUsername}" must be a parent or teacher`);
      process.exit(1);
    }
    
    // Link accounts
    const parentLinkedAccounts = parent.linkedAccounts || [];
    const childLinkedAccounts = child.linkedAccounts || [];
    
    if (!parentLinkedAccounts.includes(child.id)) {
      parentLinkedAccounts.push(child.id);
      User.updateLinkedAccounts(parent.id, parentLinkedAccounts);
    }
    
    if (!childLinkedAccounts.includes(parent.id)) {
      childLinkedAccounts.push(parent.id);
      User.updateLinkedAccounts(child.id, childLinkedAccounts);
    }
    
    console.log(`✅ Successfully linked ${childUsername} to ${parentUsername}`);
    console.log(`   Child ID: ${child.id}`);
    console.log(`   Parent ID: ${parent.id}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

linkAccounts();

