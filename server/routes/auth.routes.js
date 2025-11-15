import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { initializeDatabase } from '../database/db.js';

const router = express.Router();

// Initialize database on first load
initializeDatabase();

// Auto-login/register endpoint - creates user if doesn't exist, returns token
router.post('/auto-login', async (req, res) => {
  try {
    const { identifier, role, email, fullName } = req.body;
    
    if (!identifier || !role) {
      return res.status(400).json({ error: 'Identifier and role are required' });
    }
    
    if (!['child', 'parent', 'teacher'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Use identifier as username (usually email)
    const username = identifier;
    
    // Check if user exists
    let user = User.findByUsername(username);
    
    if (!user) {
      // Auto-create user with default password (they're already authenticated via Django)
      // In production, you might want to generate a secure random password
      const defaultPassword = `chat_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      
      user = User.create({
        username,
        password: defaultPassword, // Not used for login, just for storage
        role,
        email: email || identifier,
        fullName: fullName || identifier,
        linkedAccountIds: []
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Auto-login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Auto-login error:', error);
    res.status(500).json({ error: 'Failed to auto-login' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, email, fullName, linkedAccountIds } = req.body;
    
    // Validation
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    
    if (!['child', 'parent', 'teacher'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    // Check if user exists
    const existingUser = User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Create user
    const user = User.create({
      username,
      password,
      role,
      email,
      fullName,
      linkedAccountIds: linkedAccountIds || []
    });
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Find user
    const user = User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = User.comparePassword(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
        linkedAccounts: user.linkedAccounts
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get linked accounts
    const linkedAccounts = User.findLinkedUsers(user.id);
    
    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
      linkedAccounts: linkedAccounts.map(acc => ({
        id: acc.id,
        username: acc.username,
        role: acc.role,
        email: acc.email,
        fullName: acc.fullName
      }))
    };
    
    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;
