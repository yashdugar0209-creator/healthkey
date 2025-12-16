import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Mic, Paperclip, ThumbsUp, ThumbsDown } from 'lucide-react';
import { GeminiService } from '../../services/GeminiService';

const HealthAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your HealthKey AI Assistant. How can I help you today?", sender: 'bot', time: '10:00 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What are the symptoms of hypertension?",
    "How to manage diabetes?",
    "Book an appointment with a cardiologist",
    "Explain my lab results"
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(async () => {
      let response;
      
      if (inputText.toLowerCase().includes('symptom') || inputText.toLowerCase().includes('what')) {
        response = "I can help with that. Based on your query, here are common symptoms:\n\n" +
                  "• High blood pressure: Headaches, dizziness, blurred vision\n" +
                  "• Diabetes: Increased thirst, frequent urination, fatigue\n" +
                  "• COVID-19: Fever, cough, loss of taste/smell\n\n" +
                  "Please consult a doctor for accurate diagnosis.";
      } else if (inputText.toLowerCase().includes('appointment') || inputText.toLowerCase().includes('book')) {
        response = "I can help you book an appointment! Please specify:\n" +
                  "1. Type of specialist needed\n" +
                  "2. Preferred hospital or location\n" +
                  "3. Preferred date and time\n\n" +
                  "Or you can visit the 'Book Appointment' section directly.";
      } else if (inputText.toLowerCase().includes('lab') || inputText.toLowerCase().includes('result')) {
        response = "To help you understand lab results:\n\n" +
                  "1. Upload your lab report for AI analysis\n" +
                  "2. I'll explain medical terms in simple language\n" +
                  "3. Provide context about normal ranges\n\n" +
                  "Note: Always consult your doctor for proper interpretation.";
      } else {
        response = "I understand you're asking about health-related information. " +
                  "For accurate medical advice, please consult with a healthcare professional. " +
                  "I can help you with:\n" +
                  "• Understanding medical terms\n" +
                  "• Finding nearby hospitals/doctors\n" +
                  "• Explaining common conditions\n" +
                  "• Booking appointments";
      }

      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // In a real app, this would start voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputText("What are the common symptoms of hypertension?");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };

  const handleFeedback = (messageId, positive) => {
    console.log(`Feedback for message ${messageId}: ${positive ? 'positive' : 'negative'}`);
    // In real app, send feedback to backend
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">HealthKey AI Assistant</h3>
            <p className="text-blue-100 text-sm">Always here to help with your health questions</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {message.sender === 'bot' ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="text-xs opacity-75">{message.time}</span>
              </div>
              <p className="whitespace-pre-line">{message.text}</p>
              
              {message.sender === 'bot' && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleFeedback(message.id, true)}
                    className="p-1 hover:bg-white/20 rounded-full"
                    title="Helpful"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback(message.id, false)}
                    className="p-1 hover:bg-white/20 rounded-full"
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <button className="p-3 text-slate-600 hover:bg-slate-100 rounded-full">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your health question here..."
              className="w-full p-3 pl-4 pr-12 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                isListening
                  ? 'bg-red-100 text-red-600 animate-pulse'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-slate-500">
            AI assistant provides general information. Always consult a doctor for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthAssistant;