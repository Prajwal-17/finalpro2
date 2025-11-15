# 🚀 How to Run the Chatbot - Quick Reference

## Prerequisites
- MongoDB running
- OpenAI API key
- Node.js installed

## Quick Start (3 Commands)

### 1. Start MongoDB
```bash
docker start mongodb || docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Configure Server
```bash
cd /home/bhoomika/projectpro/server

# Create .env file
cat > .env << 'EOF'
PORT=5001
MONGO_URI=mongodb://localhost:27017/shield360
JWT_SECRET=$(openssl rand -hex 32)
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
OPENAI_MODEL=gpt-3.5-turbo
ENCRYPTION_KEY=$(openssl rand -hex 32)
CLIENT_URL=http://localhost:5173
EOF

# Edit .env and add your OPENAI_API_KEY
nano .env
```

### 3. Install & Start
```bash
# Install dependencies (first time only)
npm install

# Start server
npm start
```

## Start Frontend
```bash
cd /home/bhoomika/projectpro/frontend
npm install  # first time only
npm run dev
```

## Create Users & Test

1. **Go to:** http://localhost:5173/chat-login
2. **Register a child:**
   - Username: `child1`
   - Password: `password123`
   - Role: `Child`
3. **Register a parent:**
   - Username: `parent1`
   - Password: `password123`
   - Role: `Parent`
4. **Link accounts:**
   ```bash
   cd server
   npm run link child1 parent1
   ```
5. **Test chat:**
   - Login as child
   - Click "💬 Talk to Sparkle"
   - Type a message!

## All Servers Running?

- ✅ Node.js: http://localhost:5001/health
- ✅ Frontend: http://localhost:5173
- ✅ Django: http://localhost:8000

## Troubleshooting

**"Please log in to the chat system"**
→ Go to `/chat-login` and register/login

**"MongoDB connection error"**
→ `docker start mongodb`

**"OpenAI API error"**
→ Check `.env` file has correct `OPENAI_API_KEY`

**Chat not working?**
→ Check browser console (F12) for errors


