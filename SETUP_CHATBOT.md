# Complete Setup Guide: Shield 360 AI Chatbot with OpenAI

This guide will walk you through setting up the AI chatbot system step by step.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- OpenAI API key
- Python 3 (for Django backend - already set up)

## Step 1: Install MongoDB

### Option A: Using Docker (Recommended)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option B: Install Locally
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

## Step 2: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (you'll need it in Step 4)

## Step 3: Set Up Node.js Server

```bash
# Navigate to server directory
cd /home/bhoomika/projectpro/server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## Step 4: Configure Environment Variables

Edit `/home/bhoomika/projectpro/server/.env`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/shield360
JWT_SECRET=your_strong_jwt_secret_key_here
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
ENCRYPTION_KEY=your_32_byte_hex_key_here
CLIENT_URL=http://localhost:5173
```

**Generate secrets:**

```bash
# Generate JWT_SECRET (32 bytes hex)
openssl rand -hex 32

# Generate ENCRYPTION_KEY (32 bytes hex)
openssl rand -hex 32
```

**Example .env file:**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/shield360
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo
ENCRYPTION_KEY=f1e2d3c4b5a697887766554433221100ffeeddccbbaa998877665544332211
CLIENT_URL=http://localhost:5173
```

## Step 5: Start MongoDB

If using Docker:
```bash
docker start mongodb
```

If installed locally:
```bash
# On Linux/Mac
mongod

# On Windows
# Start MongoDB service from Services
```

## Step 6: Start Node.js Server

```bash
cd /home/bhoomika/projectpro/server
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Shield 360 Server running on port 5001
📡 WebSocket server available at ws://localhost:5001/ws/sos
```

## Step 7: Install Frontend Dependencies

```bash
cd /home/bhoomika/projectpro/frontend
npm install
```

## Step 8: Start Frontend

```bash
cd /home/bhoomika/projectpro/frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## Step 9: Test the System

### 9.1 Register a Child User

1. Go to `http://localhost:5173/chat-login`
2. Click "Don't have an account? Register"
3. Fill in:
   - Full Name: Test Child
   - Email: child@test.com
   - Role: Child
   - Username: child1
   - Password: password123
4. Click "Register"
5. You'll be redirected to dashboard with chat access

### 9.2 Register a Parent User

1. Go to `http://localhost:5173/chat-login`
2. Register with:
   - Full Name: Test Parent
   - Email: parent@test.com
   - Role: Parent
   - Username: parent1
   - Password: password123
3. Note: You'll need to link the child later (see Step 10)

### 9.3 Test Chat

1. Login as child
2. Click "💬 Talk to Sparkle" tab
3. Type a message like "Hello Sparkle!"
4. You should get a response from OpenAI

### 9.4 Test SOS Button

1. As child, click the red SOS button (bottom-right)
2. Confirm the alert
3. Login as parent in another browser/incognito
4. Parent should receive the SOS alert

## Step 10: Link Parent to Child

You need to link accounts so parents can see their child's progress.

### Option A: Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh shield360

# Get child ID
db.users.findOne({username: "child1"})

# Update parent with child ID (replace IDs with actual values)
db.users.updateOne(
  {username: "parent1"},
  {$set: {linkedAccounts: [ObjectId("CHILD_ID_HERE")]}}
)

# Also update child with parent ID
db.users.updateOne(
  {username: "child1"},
  {$set: {linkedAccounts: [ObjectId("PARENT_ID_HERE")]}}
)
```

### Option B: Create a Script

Create `server/scripts/linkAccounts.js`:

```javascript
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function linkAccounts() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const child = await User.findOne({ username: 'child1' });
  const parent = await User.findOne({ username: 'parent1' });
  
  if (child && parent) {
    parent.linkedAccounts.push(child._id);
    child.linkedAccounts.push(parent._id);
    
    await parent.save();
    await child.save();
    
    console.log('Accounts linked successfully!');
  }
  
  mongoose.connection.close();
}

linkAccounts();
```

Run it:
```bash
cd server
node scripts/linkAccounts.js
```

## Troubleshooting

### Issue: "MongoDB connection error"
**Solution:** Make sure MongoDB is running
```bash
docker ps | grep mongo
# or
mongosh --eval "db.version()"
```

### Issue: "OpenAI API error"
**Solution:** 
- Check your API key is correct
- Verify you have credits in your OpenAI account
- Check rate limits

### Issue: "WebSocket connection failed"
**Solution:**
- Make sure Node.js server is running on port 5001
- Check that token is valid
- Verify user role is parent/teacher for SOS alerts

### Issue: "Encryption error"
**Solution:**
- Make sure ENCRYPTION_KEY is exactly 32 bytes (64 hex characters)
- Regenerate if needed: `openssl rand -hex 32`

### Issue: Chat not loading
**Solution:**
- Check browser console for errors
- Verify token is stored: `localStorage.getItem('chatToken')`
- Make sure you're logged in via `/chat-login`

## Quick Test Commands

```bash
# Test MongoDB connection
mongosh shield360 --eval "db.users.countDocuments()"

# Test Node.js server
curl http://localhost:5001/health

# Test OpenAI (replace with your key)
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## File Structure

```
projectpro/
├── server/                 # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # OpenAI service
│   ├── websocket/         # WebSocket server
│   ├── .env              # Environment variables
│   └── server.js         # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Chat, SOSButton
│   │   ├── pages/        # Dashboard, ChatLogin
│   │   └── hooks/        # useSOSWebSocket
│   └── package.json
└── backend/               # Django backend (existing)
```

## Next Steps

1. ✅ Server running on port 5001
2. ✅ Frontend running on port 5173
3. ✅ MongoDB connected
4. ✅ Users registered
5. ✅ Accounts linked
6. ✅ Chat working
7. ✅ SOS alerts working

## Support

If you encounter issues:
1. Check server logs: `cd server && npm start`
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Verify OpenAI API key is valid


