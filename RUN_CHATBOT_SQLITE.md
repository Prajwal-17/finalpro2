# 🚀 How to Run Chatbot with SQLite

## Quick Start (No MongoDB Needed!)

### Step 1: Install Dependencies

```bash
cd /home/bhoomika/projectpro/server
npm install
```

### Step 2: Configure Environment

```bash
# Create .env file
cat > .env << EOF
PORT=5001
JWT_SECRET=$(openssl rand -hex 32)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
ENCRYPTION_KEY=$(openssl rand -hex 32)
CLIENT_URL=http://localhost:5173
EOF

# Edit .env and add your OpenAI API key
nano .env
```

### Step 3: Start Server

```bash
npm start
```

You should see:
```
✅ Database initialized (SQLite)
🚀 Shield 360 Server running on port 5001
💾 Using SQLite database: backend/db.sqlite3
```

### Step 4: Start Frontend

```bash
cd /home/bhoomika/projectpro/frontend
npm run dev
```

### Step 5: Test

1. Go to: http://localhost:5173/chat-login
2. Register a child user
3. Login and start chatting!

## Database Location

The chatbot uses the **same SQLite database** as your Django backend:
- Location: `/home/bhoomika/projectpro/backend/db.sqlite3`
- Tables created automatically:
  - `chat_users` - User accounts
  - `chat_logs` - Encrypted chat messages

## Link Accounts

```bash
cd server
npm run link child1 parent1
```

## No MongoDB Required!

✅ Uses SQLite (same as Django backend)
✅ No separate database setup needed
✅ All data in one place
✅ Easy to backup (just copy db.sqlite3)


