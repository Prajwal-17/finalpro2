# Gemini Chatbot Setup Guide

This guide explains how to set up the Gemini-based chatbot for POSCO awareness.

## Prerequisites

1. Python 3.8+ installed
2. Django backend running
3. Gemini API key from Google AI Studio

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install:

- `google-generativeai` - Gemini SDK
- `python-decouple` - Environment variable management

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### 3. Create .env File

Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

Add the following content to `.env`:

```env
# Django Settings
SECRET_KEY=django-insecure-j-p^h+rynv!*rgkt*utrg^(4*o(gun6-lvkz!0qb07ig*d+n7_
DEBUG=True

# Gemini API Configuration
GEMINI_API_KEY=your-actual-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

**Important:** Replace `your-actual-gemini-api-key-here` with your actual Gemini API key from step 2.

### 4. Run Django Server

```bash
cd backend
python manage.py runserver
```

The server should start on `http://localhost:8000`

### 5. Test the Chatbot

1. Start the frontend: `cd frontend && npm run dev`
2. Navigate to the chat interface
3. Send a message like "What is POSCO?"
4. You should receive a response from Gemini

## API Endpoint

The chatbot endpoint is available at:

- **URL:** `POST http://localhost:8000/api/chat/send`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (optional, not required for now)
- **Body:**
  ```json
  {
    "message": "What is POSCO?"
  }
  ```
- **Response:**
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

## Troubleshooting

### "Gemini API key not configured"

- Make sure you created the `.env` file in the `backend/` directory
- Check that `GEMINI_API_KEY` is set correctly
- Restart the Django server after creating/updating `.env`

### "Gemini SDK not installed"

- Run: `pip install google-generativeai`

### "Failed to generate response"

- Check your Gemini API key is valid
- Verify you have API quota available
- Check Django server logs for detailed error messages

## Features

- **POSCO Awareness Focus:** The chatbot is specifically trained to answer questions about POSCO Act and child safety
- **Emotion Detection:** Automatically detects emotions and safety concerns in user messages
- **Child-Friendly:** Uses simple, clear language appropriate for children
- **Safety-First:** Encourages use of SOS button when safety concerns are detected

## Model Configuration

The chatbot uses `gemini-1.5-flash` by default, which is:

- Fast and efficient
- Free tier available
- Good for conversational AI

You can change the model in `.env`:

```env
GEMINI_MODEL=gemini-1.5-pro  # For more advanced responses
```

## Notes

- The chatbot does not require authentication for now (suitable for college project)
- All chat messages are processed in real-time
- No chat history is stored (stateless implementation)
- Emotion detection uses keyword matching (same as frontend)
