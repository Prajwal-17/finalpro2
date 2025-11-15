#!/bin/bash

echo "🚀 Shield 360 Chatbot Setup Script"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if SQLite database exists
if [ -f "../backend/db.sqlite3" ]; then
    echo "✅ SQLite database found"
else
    echo "⚠️  SQLite database will be created automatically"
fi

# Install dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install

# Generate secrets
echo ""
echo "🔐 Generating security keys..."

JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=5001
JWT_SECRET=${JWT_SECRET}
OPENAI_API_KEY=your_openai_api_key_goes_here
OPENAI_MODEL=gpt-3.5-turbo
ENCRYPTION_KEY=${ENCRYPTION_KEY}
CLIENT_URL=http://localhost:5173
EOF
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your OPENAI_API_KEY"
    echo "   Get it from: https://platform.openai.com/api-keys"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your OPENAI_API_KEY"
echo "2. Run: npm start"
echo "3. Open http://localhost:5001/health to verify server is running"

