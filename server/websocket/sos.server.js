import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { initializeDatabase } from '../database/db.js';

class SOSWebSocketServer {
  constructor(server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/sos'
    });
    
    // Map of childId -> Set of WebSocket connections (parents/teachers)
    this.subscriptions = new Map();
    
    // Map of WebSocket -> user info
    this.connections = new Map();
    
    this.setup();
  }
  
  setup() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection');
      
      // Authenticate connection
      const token = this.extractToken(req);
      
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }
      
      this.authenticateConnection(ws, token);
    });
  }
  
  extractToken(req) {
    // Try to get token from query string or headers
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get('token') || 
           req.headers.authorization?.split(' ')[1];
  }
  
  async authenticateConnection(ws, token) {
    try {
      // Initialize database
      initializeDatabase();
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = User.findById(decoded.userId);
      
      if (!user) {
        ws.close(1008, 'User not found');
        return;
      }
      
      // Only parents and teachers can subscribe to SOS alerts
      if (user.role !== 'parent' && user.role !== 'teacher') {
        ws.close(1008, 'Only parents and teachers can subscribe to SOS alerts');
        return;
      }
      
      // Store connection info
      this.connections.set(ws, {
        userId: user.id,
        role: user.role,
        linkedAccounts: user.linkedAccounts || []
      });
      
      // Subscribe to all linked children
      user.linkedAccounts.forEach(childId => {
        const childIdStr = childId.toString();
        if (!this.subscriptions.has(childIdStr)) {
          this.subscriptions.set(childIdStr, new Set());
        }
        this.subscriptions.get(childIdStr).add(ws);
      });
      
      // If teacher, subscribe to all children
      if (user.role === 'teacher') {
        const allChildren = User.findAllByRole('child');
        allChildren.forEach(child => {
          const childId = child.id.toString();
          if (!this.subscriptions.has(childId)) {
            this.subscriptions.set(childId, new Set());
          }
          this.subscriptions.get(childId).add(ws);
        });
      }
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnect(ws);
      });
      
      // Send confirmation
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Successfully connected to SOS alert system'
      }));
      
      console.log(`User ${user.username} (${user.role}) connected to SOS alerts`);
    } catch (error) {
      console.error('Authentication error:', error);
      ws.close(1008, 'Authentication failed');
    }
  }
  
  handleMessage(ws, data) {
    // Handle ping/pong for keepalive
    if (data.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
    }
  }
  
  handleDisconnect(ws) {
    const connection = this.connections.get(ws);
    if (connection) {
      // Remove from all subscriptions
      this.subscriptions.forEach((subscribers, childId) => {
        subscribers.delete(ws);
        if (subscribers.size === 0) {
          this.subscriptions.delete(childId);
        }
      });
      
      this.connections.delete(ws);
      console.log(`User disconnected from SOS alerts`);
    }
  }
  
  // Broadcast SOS alert to all subscribed parents/teachers for a child
  broadcastSOS(childId, childInfo, message = null) {
    const childIdStr = childId.toString();
    const subscribers = this.subscriptions.get(childIdStr);
    
    if (!subscribers || subscribers.size === 0) {
      console.log(`No subscribers for child ${childIdStr}`);
      return;
    }
    
    const alert = {
      type: 'SOS_ALERT',
      timestamp: new Date().toISOString(),
      child: {
        id: childId,
        username: childInfo.username,
        email: childInfo.email,
        fullName: childInfo.fullName
      },
      message: message || 'A child has triggered an SOS alert and needs immediate help.',
      urgent: true
    };
    
    let sentCount = 0;
    subscribers.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        try {
          ws.send(JSON.stringify(alert));
          sentCount++;
        } catch (error) {
          console.error('Error sending SOS alert:', error);
          subscribers.delete(ws);
        }
      } else {
        subscribers.delete(ws);
      }
    });
    
    console.log(`SOS alert sent to ${sentCount} subscribers for child ${childIdStr}`);
    return sentCount;
  }
}

export default SOSWebSocketServer;

