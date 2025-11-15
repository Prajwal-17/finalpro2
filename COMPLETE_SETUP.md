# 🎯 Complete Setup Guide - Shield 360 AI Chatbot with OpenAI

## Overview

This guide will help you set up the complete AI chatbot system with:
- ✅ OpenAI GPT integration
- ✅ Encrypted chat logs
- ✅ Real-time SOS alerts
- ✅ Emotion detection
- ✅ Role-based dashboards

---

## 📋 Prerequisites Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB installed or Docker
- [ ] OpenAI API key
- [ ] Python 3 (for Django - already set up)

---

## 🔧 Step-by-Step Setup

### Step 1: Install MongoDB

**Using Docker (Recommended):**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
docker ps  # Verify it's running
```

**Or Install Locally:**
- Download: https://www.mongodb.com/try/download/community
- Follow installation instructions for your OS

---

### Step 2: Get OpenAI API Key

1. Visit: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click **"Create new secret key"**
4. **Copy the key** (you won't see it again!)
5. Make sure you have credits in your account

---

### Step 3: Set Up Node.js Server

```bash
# Navigate to server directory
cd /home/bhoomika/projectpro/server

# Install dependencies
npm install

# Generate secrets and create .env
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

cat > .env << EOF
PORT=5001
MONGO_URI=mongodb://localhost:27017/shield360
JWT_SECRET=${JWT_SECRET}
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
ENCRYPTION_KEY=${ENCRYPTION_KEY}
CLIENT_URL=http://localhost:5173
EOF

# Edit .env and replace OPENAI_API_KEY with your actual key
nano .env  # or use your preferred editor
```

**Or use the setup script:**
```bash
chmod +x setup.sh
./setup.sh
# Then edit .env to add your OPENAI_API_KEY
```

---

### Step 4: Start All Servers

**Terminal 1 - Node.js Chatbot Server:**
```bash
cd /home/bhoomika/projectpro/server
npm start
```

**Expected output:**
```
✅ Connected to MongoDB
🚀 Shield 360 Server running on port 5001
📡 WebSocket server available at ws://localhost:5001/ws/sos
🔐 Make sure to set OPENAI_API_KEY in .env file
```

**Terminal 2 - React Frontend:**
```bash
cd /home/bhoomika/projectpro/frontend
npm install  # First time only
npm run dev
```

**Expected output:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Terminal 3 - Django Backend (for quizzes):**
```bash
cd /home/bhoomika/projectpro/backend
source venv/bin/activate  # or .venv/bin/activate
python manage.py runserver
```

---

### Step 5: Create Test Users

1. **Open browser:** http://localhost:5173/chat-login

2. **Register a Child:**
   - Click "Don't have an account? Register"
   - Fill in:
     ```
     Full Name: Test Child
     Email: child@test.com
     Role: Child
     Username: child1
     Password: password123
     ```
   - Click "Register"
   - You'll be redirected to dashboard

3. **Register a Parent:**
   - Open new incognito window or different browser
   - Go to: http://localhost:5173/chat-login
   - Register with:
     ```
     Full Name: Test Parent
     Email: parent@test.com
     Role: Parent
     Username: parent1
     Password: password123
     ```

---

### Step 6: Link Parent to Child

**Option A: Using Script (Easiest)**
```bash
cd /home/bhoomika/projectpro/server
npm run link child1 parent1
```

**Option B: Using MongoDB Shell**
```bash
mongosh shield360

# Get user IDs
db.users.find({username: {$in: ["child1", "parent1"]}}, {username: 1, _id: 1})

# Link them (replace IDs with actual values)
db.users.updateOne(
  {username: "parent1"},
  {$set: {linkedAccounts: [ObjectId("CHILD_ID_HERE")]}}
)

db.users.updateOne(
  {username: "child1"},
  {$set: {linkedAccounts: [ObjectId("PARENT_ID_HERE")]}}
)
```

---

### Step 7: Test the System

#### Test Chat:
1. Login as child (http://localhost:5173/chat-login)
2. Go to dashboard
3. Click "💬 Talk to Sparkle"
4. Type: "Hello Sparkle!"
5. You should get a response from OpenAI

#### Test SOS:
1. As child, click the red **SOS button** (bottom-right corner)
2. Confirm the alert
3. Login as parent in another browser/incognito
4. Parent should see a **red alert modal** with sound

#### Test Progress Viewing:
1. Login as parent
2. Go to dashboard
3. Enter child's email in the lookup field
4. View chat history (if child has chatted)

---

## 🧪 Quick Verification

```bash
# Test Node.js server
curl http://localhost:5001/health
# Should return: {"status":"ok","service":"Shield 360 AI Chatbot Server"}

# Test MongoDB
mongosh shield360 --eval "db.users.countDocuments()"
# Should return a number

# Test OpenAI (replace with your key)
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
# Should return list of models
```

---

## 🔍 Troubleshooting

### Issue: "Please log in to the chat system"
**Solution:**
- Go to http://localhost:5173/chat-login
- Register or login
- Token will be stored automatically

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Check if MongoDB is running
docker ps | grep mongo
# or
mongosh --eval "db.version()"

# Start MongoDB
docker start mongodb
# or
mongod
```

### Issue: "OpenAI API error" or "Failed to get AI response"
**Solution:**
1. Check `.env` file has correct `OPENAI_API_KEY`
2. Verify key starts with `sk-`
3. Check you have credits: https://platform.openai.com/usage
4. Verify rate limits haven't been exceeded

### Issue: "WebSocket connection failed"
**Solution:**
- Make sure Node.js server is running on port 5001
- Check browser console (F12) for errors
- Verify token: Open browser console and type `localStorage.getItem('chatToken')`
- Should return a JWT token string

### Issue: "Encryption error"
**Solution:**
- `ENCRYPTION_KEY` must be exactly 64 hex characters (32 bytes)
- Regenerate: `openssl rand -hex 32`
- Update in `.env` file

### Issue: Chat not responding
**Solution:**
1. Check server logs for errors
2. Verify OpenAI API key is valid
3. Check browser network tab (F12) for failed requests
4. Ensure you're logged in as a "child" role

---

## 📁 Important Files

```
server/
├── .env                    # ⚠️ ADD YOUR OPENAI_API_KEY HERE
├── server.js               # Main server file
├── models/
│   ├── User.model.js       # User schema
│   └── ChatLog.model.js    # Encrypted chat logs
├── routes/
│   ├── auth.routes.js      # Login/Register
│   ├── chat.routes.js      # Chat with OpenAI
│   ├── data.routes.js      # View progress
│   └── sos.routes.js       # SOS alerts
└── services/
    └── openai.service.js   # OpenAI integration

frontend/
└── src/
    ├── pages/
    │   ├── ChatLogin.jsx   # Login page
    │   └── Dashboard.jsx  # Main dashboard
    └── components/
        ├── Chat.jsx        # Chat interface
        └── SOSButton.jsx   # SOS button
```

---

## 🎮 Usage Flow

### For Children:
1. Register/Login at `/chat-login`
2. Go to dashboard
3. Click "💬 Talk to Sparkle"
4. Chat with AI
5. Use SOS button if needed

### For Parents/Teachers:
1. Register/Login at `/chat-login`
2. Link to child (see Step 6)
3. Go to dashboard
4. View child's progress
5. Receive SOS alerts automatically

---

## 🔐 Security Notes

- ✅ All chat messages are encrypted before storing
- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens expire after 7 days
- ✅ Role-based access control enforced
- ✅ Only linked parents/teachers can see child data

---

## 📞 Support

If you encounter issues:

1. **Check server logs:** Look at Terminal 1 (Node.js server)
2. **Check browser console:** Press F12, look at Console tab
3. **Verify environment:** Make sure all variables in `.env` are set
4. **Test endpoints:** Use curl or Postman to test API directly

---

## ✅ Success Checklist

- [ ] MongoDB running
- [ ] Node.js server running on port 5001
- [ ] Frontend running on port 5173
- [ ] Django backend running on port 8000
- [ ] OpenAI API key set in `.env`
- [ ] Child user registered
- [ ] Parent user registered
- [ ] Accounts linked
- [ ] Chat working
- [ ] SOS alerts working

---

## 🚀 You're All Set!

Once everything is running:
- Children can chat with Sparkle
- Parents can monitor progress
- SOS alerts work in real-time
- All data is encrypted and secure

Happy coding! 🎉


