import express from 'express';
import ChatLog from '../models/ChatLog.model.js';
import User from '../models/User.model.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { initializeDatabase } from '../database/db.js';

const router = express.Router();

// Initialize database on first load
initializeDatabase();

// Get chat progress for a specific child (parent/teacher only)
router.get('/progress/:childId', authenticate, requireRole('parent', 'teacher'), async (req, res) => {
  try {
    const { childId } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
    
    // Find the child user
    const child = User.findById(parseInt(childId));
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    
    // RBAC: Check if requester has access to this child
    if (requesterRole === 'parent' || requesterRole === 'teacher') {
      // Check if child is in requester's linkedAccounts OR requester is in child's linkedAccounts
      const childLinkedAccounts = child.linkedAccounts || [];
      const requesterLinkedAccounts = req.user.linkedAccounts || [];
      
      const hasAccess = 
        childLinkedAccounts.includes(requesterId) ||
        requesterLinkedAccounts.includes(parseInt(childId));
      
      // Teachers can see all children (for now - adjust based on requirements)
      if (requesterRole !== 'teacher' && !hasAccess) {
        return res.status(403).json({ error: 'Access denied. You are not linked to this child.' });
      }
    }
    
    // Get chat logs for this child
    const limit = parseInt(req.query.limit) || 100;
    const logs = ChatLog.findDecrypted(parseInt(childId), limit);
    
    // Calculate statistics
    const totalMessages = logs.reduce((sum, log) => sum + (log.messages?.length || 0), 0);
    const safetyConcerns = logs.filter(log => log.detectedEmotion === 'concerned').length;
    const lastActivity = logs.length > 0 ? logs[0].timestamp : null;
    
    res.json({
      child: {
        id: child.id,
        username: child.username,
        email: child.email,
        fullName: child.fullName
      },
      chatHistory: logs,
      statistics: {
        totalMessages,
        safetyConcerns,
        lastActivity,
        totalSessions: logs.length
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Get list of linked children (parent/teacher only)
router.get('/children', authenticate, requireRole('parent', 'teacher'), async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let children = [];
    
    if (role === 'teacher') {
      // Teachers can see all children
      const allChildren = User.findAllByRole('child');
      children = allChildren.map(child => ({
        id: child.id,
        username: child.username,
        email: child.email,
        fullName: child.fullName,
        linkedAccounts: User.findLinkedUsers(child.id)
      }));
    } else {
      // Parents see only their linked children
      const linkedUsers = User.findLinkedUsers(userId);
      children = linkedUsers.filter(account => account.role === 'child').map(child => ({
        id: child.id,
        username: child.username,
        email: child.email,
        fullName: child.fullName
      }));
    }
    
    res.json({ children });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({ error: 'Failed to get children list' });
  }
});

export default router;
