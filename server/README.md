# Shield 360 AI Chatbot Server

Node.js/Express server with Gemini AI integration, WebSocket SOS alerts, and encrypted chat logs.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/shield360
JWT_SECRET=your_strong_jwt_secret_key_change_this_in_production
GEMINI_API_KEY=your_gemini_api_key_goes_here
ENCRYPTION_KEY=your_32_byte_hex_key_for_encryption
CLIENT_URL=http://localhost:5173
```

**Important:**
- Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Generate a strong JWT secret (e.g., `openssl rand -hex 32`)
- Generate a 32-byte hex key for encryption: `openssl rand -hex 32`

### 3. MongoDB Setup

Make sure MongoDB is running:

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
# See: https://www.mongodb.com/docs/manual/installation/
```

### 4. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (protected)

### Chat
- `POST /api/chat/send` - Send message to AI (child only, protected)
- `GET /api/chat/history` - Get chat history (child only, protected)

### Data
- `GET /api/data/progress/:childId` - Get child's chat progress (parent/teacher only, protected)
- `GET /api/data/children` - Get list of linked children (parent/teacher only, protected)

### SOS
- `POST /api/sos/trigger` - Trigger SOS alert (child only, protected)

## WebSocket

- **Endpoint:** `ws://localhost:5001/ws/sos`
- **Authentication:** Pass JWT token as query parameter: `?token=YOUR_JWT_TOKEN`
- **Message Types:**
  - `ping` - Keepalive
  - `SOS_ALERT` - Received when a child triggers SOS

## Security Features

1. **Encrypted Chat Logs:** All chat messages are encrypted using AES-256-GCM before storing in MongoDB
2. **JWT Authentication:** All protected routes require valid JWT token
3. **Role-Based Access Control:** Parents/teachers can only access their linked children's data
4. **Safety-First AI:** Gemini AI is configured with strict safety prompts to redirect children to trusted adults

## Integration with Frontend

The frontend should:
1. Login/register users via `/api/auth/*` endpoints
2. Store the JWT token in localStorage as `chatToken`
3. Connect to WebSocket at `ws://localhost:5001/ws/sos?token=YOUR_TOKEN`
4. Use the token in Authorization header for all API calls: `Bearer YOUR_TOKEN`

## Testing

You can test the API using curl or Postman:

```bash
# Register a child
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "child1",
    "password": "password123",
    "role": "child",
    "email": "child1@example.com",
    "fullName": "Test Child"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "child1",
    "password": "password123"
  }'
```

## Troubleshooting

1. **MongoDB Connection Error:** Make sure MongoDB is running and MONGO_URI is correct
2. **Gemini API Error:** Verify GEMINI_API_KEY is set correctly
3. **WebSocket Connection Failed:** Check that token is valid and user role is parent/teacher
4. **Encryption Errors:** Ensure ENCRYPTION_KEY is a 32-byte hex string


