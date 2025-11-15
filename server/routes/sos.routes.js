import express from 'express';
import User from '../models/User.model.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Trigger SOS alert (child only)
router.post('/trigger', authenticate, requireRole('child'), async (req, res) => {
  try {
    const childId = req.user.id;
    const { message } = req.body;
    
    // Get child info
    const child = User.findById(childId);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    
    const childInfo = {
      username: child.username,
      email: child.email,
      fullName: child.fullName
    };
    
    // Broadcast SOS alert via WebSocket server
    let broadcastCount = 0;
    if (req.app.locals.sosServer) {
      broadcastCount = req.app.locals.sosServer.broadcastSOS(childId, childInfo, message);
    }
    
    res.json({
      success: true,
      message: 'SOS alert has been sent to your trusted adults',
      timestamp: new Date().toISOString(),
      recipientsNotified: broadcastCount
    });
  } catch (error) {
    console.error('SOS trigger error:', error);
    res.status(500).json({ error: 'Failed to trigger SOS alert' });
  }
});

export default router;

