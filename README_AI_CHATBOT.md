# Shield 360 - AI Chatbot Integration Guide

This document explains how to integrate the new AI chatbot system with the existing Shield 360 application.

## Architecture Overview

The application now has **two backend servers**:

1. **Django Backend** (Port 8000) - Handles quiz functionality
2. **Node.js Backend** (Port 5001) - Handles AI chatbot, SOS alerts, and chat logs

## Quick Start

### 1. Backend Setup (Node.js Server)

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY, JWT_SECRET, etc.
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. MongoDB Setup

Make sure MongoDB is running:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## User Flow

### For Children:

1. **Login to Chat System:**
   - Children need to register/login via the Node.js auth system (`/api/auth/register` or `/api/auth/login`)
   - This gives them a JWT token stored as `chatToken` in localStorage
   - The existing Django login can remain for quiz functionality

2. **Chat with Sparkle:**
   - Click "Talk to Sparkle" tab in dashboard
   - Type messages or use voice input (🎤 button)
   - Emotion detection works in real-time
   - SOS button is always visible (bottom-right)

3. **SOS Alert:**
   - Click the red SOS button
   - Confirm the alert
   - Alert is immediately sent to linked parents/teachers via WebSocket

### For Parents/Teachers:

1. **Login to Chat System:**
   - Register/login via Node.js auth system
   - Get JWT token stored as `chatToken`

2. **View Child Progress:**
   - Access `/api/data/progress/:childId` to see encrypted chat history
   - Only works if child is in your `linkedAccounts`

3. **Receive SOS Alerts:**
   - Automatically connected to WebSocket when dashboard loads
   - Receives real-time SOS alerts with sound and visual notification
   - Can acknowledge alerts

## Linking Accounts

To link a parent/teacher to a child:

1. Register the child first, note their `_id`
2. Register the parent/teacher with `linkedAccountIds: [childId]`
3. Or update the child's `linkedAccounts` to include parent/teacher `_id`

## API Integration Example

```javascript
// Login to chat system
const response = await axios.post('http://localhost:5001/api/auth/login', {
  username: 'child1',
  password: 'password123'
});

const { token } = response.data;
localStorage.setItem('chatToken', token);

// Send chat message
await axios.post('http://localhost:5001/api/chat/send', 
  { message: 'Hello Sparkle!' },
  { headers: { Authorization: `Bearer ${token}` } }
);

// Trigger SOS
await axios.post('http://localhost:5001/api/sos/trigger',
  { message: 'I need help' },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

## WebSocket Connection

```javascript
import { useSOSWebSocket } from '../hooks/useSOSWebSocket';

function ParentDashboard({ token }) {
  const handleSOSAlert = (alert) => {
    console.log('SOS Alert!', alert);
    // Show modal, play sound, etc.
  };

  useSOSWebSocket(token, handleSOSAlert);
  // ...
}
```

## Security Features

1. **Encrypted Storage:** All chat messages encrypted with AES-256-GCM
2. **JWT Authentication:** Secure token-based auth
3. **RBAC:** Role-based access control for data
4. **Safety-First AI:** Gemini configured with trauma-informed prompts

## Environment Variables

### Server (.env)
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/shield360
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
ENCRYPTION_KEY=your_32_byte_hex_key
CLIENT_URL=http://localhost:5173
```

## Testing

1. Register a child user
2. Register a parent user with child in `linkedAccounts`
3. Login as child, send messages to Sparkle
4. Login as parent, view progress
5. Trigger SOS as child, see alert as parent

## Troubleshooting

- **Chat not working:** Check if token is set in localStorage
- **SOS not alerting:** Verify WebSocket connection and linked accounts
- **Encryption errors:** Check ENCRYPTION_KEY is 32 bytes hex
- **Gemini errors:** Verify API key is correct

## Next Steps

1. Integrate Node.js auth with existing Django login
2. Add user migration from Django to Node.js
3. Enhance emotion detection with ML models
4. Add voice emotion analysis
5. Implement notification system for parents


