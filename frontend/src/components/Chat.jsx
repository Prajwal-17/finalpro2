import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { detectEmotion, getEmotionIcon, getEmotionColor } from '../utils/emotionDetection';

const API_BASE = 'http://localhost:5001/api';

function Chat({ token, onSOSTrigger }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState({ emotion: 'neutral', level: 0 });
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

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
      const response = await axios.post(
        `${API_BASE}/chat/send`,
        { message: userMessage },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
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
      const errorMessage = {
        role: 'model',
        content: 'Sorry, I had trouble understanding that. Please try again or use the SOS button if you need help.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setInput(transcript);
      
      if (event.results[event.results.length - 1].isFinal) {
        setIsListening(false);
        recognition.stop();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
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
            type="button"
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
              isListening
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
            }`}
            title="Talk to Sparkle"
          >
            {isListening ? '🛑' : '🎤'}
          </button>
          
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


