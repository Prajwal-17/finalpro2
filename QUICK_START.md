# 🚀 Quick Start Guide - Shield 360 AI Chatbot

## Complete Setup in 5 Steps

### Step 1: Install MongoDB

**Option A: Using Docker (Easiest)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Install Locally**
- Download: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Step 2: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign up/Login
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 3: Set Up Node.js Server

```bash
cd /home/bhoomika/projectpro/server

# Run setup script (auto-generates secrets)
./setup.sh

# OR manually:
npm install

# Create .env file
cat > .env << EOF
PORT=5001
MONGO_URI=mongodb://localhost:27017/shield360
JWT_SECRET=$(openssl rand -hex 32)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo
ENCRYPTION_KEY=$(openssl rand -hex 32)
CLIENT_URL=http://localhost:5173
EOF

# Edit .env and add your OPENAI_API_KEY
nano .env  # or use your preferred editor
```

### Step 4: Start Servers

**Terminal 1 - Node.js Server:**
```bash
cd /home/bhoomika/projectpro/server
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Shield 360 Server running on port 5001
```

**Terminal 2 - Frontend:**
```bash
cd /home/bhoomika/projectpro/frontend
npm install  # if not done already
npm run dev
```

**Terminal 3 - Django Backend (for quizzes):**
```bash
cd /home/bhoomika/projectpro/backend
source venv/bin/activate  # or .venv/bin/activate
python manage.py runserver
```

### Step 5: Test the Chatbot

1. **Open browser:** http://localhost:5173/dashboard

2. **Register a child:**
   - Go to: http://localhost:5173/chat-login
   - Click "Don't have an account? Register"
   - Fill in:
     - Full Name: Test Child
     - Email: child@test.com
     - Role: Child
     - Username: child1
     - Password: password123
   - Click "Register"
   - You'll be redirected to dashboard

3. **Start chatting:**
   - Click "💬 Talk to Sparkle" tab
   - Type: "Hello Sparkle!"
   - You should get a response from OpenAI

4. **Test SOS:**
   - Click the red SOS button (bottom-right)
   - Confirm the alert

## Linking Parent to Child (For Testing SOS)

After registering both child and parent, link them:

```bash
# Connect to MongoDB
mongosh shield360

# Get IDs
db.users.find({}, {username: 1, _id: 1})

# Link (replace IDs with actual values)
db.users.updateOne(
  {username: "parent1"},
  {$set: {linkedAccounts: [ObjectId("CHILD_ID")]}}
)

db.users.updateOne(
  {username: "child1"},
  {$set: {linkedAccounts: [ObjectId("PARENT_ID")]}}
)
```

## Troubleshooting

### "Please log in to the chat system"
**Solution:** Go to `/chat-login` and register/login

### "MongoDB connection error"
**Solution:** 
```bash
docker start mongodb
# or
mongod
```

### "OpenAI API error"
**Solution:**
- Check API key in `.env` file
- Verify you have credits: https://platform.openai.com/usage
- Check rate limits

### "WebSocket connection failed"
**Solution:**
- Make sure Node.js server is running on port 5001
- Check browser console for errors
- Verify token exists: `localStorage.getItem('chatToken')`

## File Locations

- **Server:** `/home/bhoomika/projectpro/server/`
- **Frontend:** `/home/bhoomika/projectpro/frontend/`
- **Django Backend:** `/home/bhoomika/projectpro/backend/`
- **Environment:** `/home/bhoomika/projectpro/server/.env`

## API Endpoints

- **Health:** http://localhost:5001/health
- **Register:** POST http://localhost:5001/api/auth/register
- **Login:** POST http://localhost:5001/api/auth/login
- **Chat:** POST http://localhost:5001/api/chat/send
- **SOS:** POST http://localhost:5001/api/sos/trigger

## Quick Test

```bash
# Test server
curl http://localhost:5001/health

# Test MongoDB
mongosh shield360 --eval "db.users.countDocuments()"
```

## Need Help?

1. Check server logs: `cd server && npm start`
2. Check browser console (F12)
3. Verify all environment variables in `.env`
4. Ensure MongoDB is running
5. Verify OpenAI API key is valid


