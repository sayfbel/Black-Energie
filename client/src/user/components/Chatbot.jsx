import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './chatbot.css';

export const Chatbot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Dynamic greetings, placeholders and titles based on language
  const greetings = {
    en: "Greetings, guest. I am Elysia, your Digital Sommelier & Concierge. How may I guide you through our luxury coffee collections or assist with your brewing journey today?",
    fr: "Salutations, cher client. Je suis Elysia, votre Sommelière & Concierge Digitale. Comment puis-je vous guider à travers nos collections de café de luxe ou vous assister dans votre rituel de préparation aujourd'hui ?",
    ar: "مرحباً بك، ضيفنا العزيز. أنا إليسيا، مستشارتك الرقمية للقهوة الفاخرة. كيف يمكنني إرشادك اليوم عبر تشكيلاتنا الفاخرة أو مساعدتك في طريقة التحضير المثالية؟"
  };

  const placeholders = {
    en: "Ask about flavor profiles, brewing rituals...",
    fr: "Posez vos questions sur nos arômes, rituels...",
    ar: "اسأل عن نكهات القهوة، طرق التحضير..."
  };

  const statusLabel = {
    en: "Digital Sommelier",
    fr: "Sommelière Digitale",
    ar: "مستشارة رقمية"
  };

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: greetings[language] || greetings.en
    }
  ]);

  // Update initial message when language changes if no conversation has started
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'assistant') {
        return [{
          sender: 'assistant',
          text: greetings[language] || greetings.en
        }];
      }
      return prev;
    });
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Map message history to schema expected by Gemini
      const chatHistory = messages.map(msg => ({
        role: msg.sender,
        content: msg.text
      }));

      const res = await axios.post('/api/chat', {
        message: userMessage,
        history: chatHistory,
        language: language // Pass active language context to the server
      });

      setMessages(prev => [...prev, { sender: 'assistant', text: res.data.reply }]);
    } catch (err) {
      console.error("Chatbot API Error:", err);
      
      const errorMessage = {
        en: "I apologize, but I am momentarily experiencing difficulty communicating. Please check your connection.",
        fr: "Je m'excuse, mais je rencontre temporairement des difficultés de communication. Veuillez vérifier votre connexion.",
        ar: "أعتذر منك، أواجه صعوبة مؤقتة في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت."
      };

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: errorMessage[language] || errorMessage.en
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isRtl = language === 'ar';

  return (
    <div className={`chatbot-widget-container ${isRtl ? 'chatbot-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Floating Toggle Button */}
      <motion.button
        className={`chatbot-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Chatbot"
      >
        {isOpen ? <X size={20} strokeWidth={1.5} /> : <MessageSquare size={20} strokeWidth={1.5} />}
        {!isOpen && (
          <span className="chatbot-pulse-glow" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-profile">
                <div className="chatbot-avatar">
                  <Sparkles size={14} className="avatar-spark-icon" />
                </div>
                <div>
                  <h3>Elysia</h3>
                  <span className="chatbot-status">{statusLabel[language] || statusLabel.en}</span>
                </div>
              </div>
              <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages-area">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'assistant-wrapper'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="chat-mini-avatar">E</div>
                  )}
                  <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="chat-bubble-wrapper assistant-wrapper">
                  <div className="chat-mini-avatar">E</div>
                  <div className="chat-bubble assistant-bubble loading-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form className="chatbot-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder={placeholders[language] || placeholders.en}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Send message">
                <Send size={16} strokeWidth={1.5} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
