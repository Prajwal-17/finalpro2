import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeDatabase } from './database/db.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import dataRoutes from './routes/data.routes.js';
import sosRoutes from './routes/sos.routes.js';
import SOSWebSocketServer from './websocket/sos.server.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize WebSocket server
const sosServer = new SOSWebSocketServer(server);
app.locals.sosServer = sosServer;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Shield 360 AI Chatbot Server' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/sos', sosRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Initialize SQLite database
try {
  initializeDatabase();
  console.log('✅ Database initialized (SQLite)');
  
  // Start server
  server.listen(PORT, () => {
    console.log(`🚀 Shield 360 Server running on port ${PORT}`);
    console.log(`📡 WebSocket server available at ws://localhost:${PORT}/ws/sos`);
    console.log(`💾 Using SQLite database: backend/db.sqlite3`);
    console.log(`🔐 Make sure to set OPENAI_API_KEY in .env file`);
  });
} catch (error) {
  console.error('❌ Database initialization error:', error);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

export default app;

