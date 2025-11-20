import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { detectEmotion, getEmotionColor, getEmotionIcon } from '../utils/emotionDetection';

const API_BASE = 'http://localhost:8000/api';

function Chat({ token }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState({ emotion: 'neutral', level: 0 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize emotion detection on input change
    if (input) {
      const emotion = detectEmotion(input);
      setCurrentEmotion(emotion);
      
      // If safety concern detected, suggest SOS
      if (emotion.hasSafetyConcern) {
        // Could show a subtle prompt here
      }
    } else {
      setCurrentEmotion({ emotion: 'neutral', level: 0 });
    }
  }, [input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message to UI
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post(
        `${API_BASE}/chat/send`,
        { message: userMessage },
        { headers }
      );

      // Add AI response to UI
      const aiMessage = {
        role: 'model',
        content: response.data.response,
        timestamp: new Date(),
        emotion: response.data.detectedEmotion
      };
      setMessages(prev => [...prev, aiMessage]);

      // If safety concern detected, suggest SOS
      if (response.data.hasSafetyConcern) {
        // Could trigger a gentle SOS suggestion here
        console.log('Safety concern detected in response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorMsg = 'Sorry, I had trouble understanding that. Please try again.';
      
      if (error.response) {
        // Server responded with error
        const serverError = error.response.data?.error || error.response.data?.details;
        if (serverError) {
          errorMsg = `Error: ${serverError}`;
        } else {
          errorMsg = `Server error: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Request made but no response
        errorMsg = 'Unable to connect to server. Please check if Django backend is running on port 8000.';
      } else {
        errorMsg = `Error: ${error.message}`;
      }
      
      const errorMessage = {
        role: 'model',
        content: errorMsg,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Chat Header */}
      <div className="border-b border-slate-800 p-4 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className={`text-3xl ${getEmotionColor(currentEmotion.emotion)}`}>
            {getEmotionIcon(currentEmotion.emotion)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Sparkle</h3>
            <p className="text-xs text-slate-400">Your safe AI friend</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            <p className="text-lg mb-2">👋 Hi! I'm Sparkle.</p>
            <p className="text-sm">I'm here to listen and help. You can talk to me about anything.</p>
            <p className="text-xs mt-2 text-slate-500">Remember: If you ever feel unsafe, press the SOS button.</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-primary text-slate-950'
                  : msg.isError
                  ? 'bg-red-900/30 text-red-300 border border-red-800'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs mt-1 opacity-60">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800 p-4 bg-slate-900/50">
        <form onSubmit={handleSend} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={loading}
            />
            {currentEmotion.hasSafetyConcern && (
              <div className="absolute top-1 right-2 text-xs text-red-400">
                💡 Consider using SOS button
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-3 rounded-lg bg-primary text-slate-950 font-semibold transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;


