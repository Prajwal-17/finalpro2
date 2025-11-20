# Chat Route Information

## Frontend Route to Access Chat

**URL:** `http://localhost:5173/dashboard`

**Steps to Access:**
1. Login first at `http://localhost:5173/login` (or `/login/child`, `/login/parent`, etc.)
2. After login, you'll be redirected to `/dashboard`
3. Click on the **"💬 Talk to Sparkle"** button/tab
4. The chat interface will appear

## Backend Chat Endpoint

**Django Endpoint:** `POST http://localhost:8000/api/chat/send`

**Request Format:**
```json
{
  "message": "What is POSCO?"
}
```

**Response Format:**
```json
{
  "response": "POSCO stands for Protection of Children from Sexual Offences Act...",
  "detectedEmotion": {
    "emotion": "neutral",
    "level": 0,
    "hasSafetyConcern": false
  },
  "hasSafetyConcern": false
}
```

**Headers (Optional):**
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (optional, not required)

## Quick Test

1. **Start Django Backend:**
   ```bash
   cd backend
   source venv/bin/activate  # or .venv/bin/activate
   python manage.py runserver
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Chat:**
   - Go to: `http://localhost:5173/dashboard`
   - Click "💬 Talk to Sparkle"
   - Type a message and press Send

## Troubleshooting

### Dashboard is Empty/Stuck
- Check browser console for errors
- Make sure you're logged in (check localStorage for `userRole` and `userIdentifier`)
- Verify Django server is running on port 8000
- Check that `.env` file has `GEMINI_API_KEY` set

### Chat Not Responding
- Check Django server logs for errors
- Verify Gemini API key is correct in `.env`
- Check browser Network tab to see if request is being sent
- Ensure CORS is properly configured in Django settings

### 404 Errors
- Make sure Django server is running
- Check that URL routes are correct (`/api/chat/send`)
- Verify `api/urls.py` includes the chat route

