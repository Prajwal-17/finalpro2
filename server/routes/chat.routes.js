import express from 'express';
import ChatLog from '../models/ChatLog.model.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { getOpenAIResponse, detectSafetyConcerns } from '../services/openai.service.js';

const router = express.Router();

// Send message to AI chatbot (child only)
router.post('/send', authenticate, requireRole('child'), async (req, res) => {
  try {
    const { message } = req.body;
    const childId = req.user._id;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Detect emotion/safety concerns
    const hasSafetyConcern = detectSafetyConcerns(message);
    const detectedEmotion = hasSafetyConcern ? 'concerned' : 'neutral';
    
    // Get recent conversation history
    const recentLogs = ChatLog.findByChildId(childId, 1);
    
    let conversationHistory = [];
    if (recentLogs.length > 0) {
      const recentLog = recentLogs[0];
      conversationHistory = recentLog.messages || [];
      // Keep only last 10 messages for context
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }
    }
    
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: message.trim()
    });
    
    // Get AI response
    const aiResponse = await getOpenAIResponse(message, conversationHistory);
    
    // Add AI response to history
    conversationHistory.push({
      role: 'model',
      content: aiResponse
    });
    
    // Save to database (will be encrypted automatically)
    const chatLog = ChatLog.create({
      childId,
      messages: conversationHistory,
      detectedEmotion
    });
    
    res.json({
      response: aiResponse,
      detectedEmotion,
      hasSafetyConcern,
      timestamp: chatLog.timestamp
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history for child (child only)
router.get('/history', authenticate, requireRole('child'), async (req, res) => {
  try {
    const childId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    
    const logs = ChatLog.findDecrypted(childId, limit);
    
    res.json({ chatHistory: logs });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

export default router;
