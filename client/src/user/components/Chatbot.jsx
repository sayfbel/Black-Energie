import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Coffee, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import './chatbot.css';

const quickOptions = [
  {
    id: 'shop',
    labels: { en: "Explore Shop", fr: "Explorer la Boutique", ar: "استكشاف المتجر" },
    query: {
      en: "Tell me about your single origin coffee products in the Shop.",
      fr: "Parlez-moi des cafés d'origine unique disponibles dans la boutique.",
      ar: "أخبرني عن منتجات القهوة ذات الأصل الواحد المتاحة في المتجر."
    }
  },
  {
    id: 'packs',
    labels: { en: "Coffee Packs", fr: "Packs de Café", ar: "باقات القهوة" },
    query: {
      en: "What coffee Packs and collections do you offer?",
      fr: "Quels packs et collections de café proposez-vous ?",
      ar: "ما هي باقات ومجموعات القهوة التي تقدمونها؟"
    }
  },
  {
    id: 'magazine',
    labels: { en: "Magazine", fr: "Magazine", ar: "المجلة" },
    query: {
      en: "Tell me about your Magazine and digital community.",
      fr: "Parlez-moi de votre magazine et de votre communauté digitale.",
      ar: "أخبرني عن المجلة والمجتمع الرقمي لبلاك إنيرجي."
    }
  },
  {
    id: 'faqs',
    labels: { en: "FAQs & Support", fr: "FAQ & Support", ar: "الأسئلة الشائعة" },
    query: {
      en: "What are the most frequently asked questions?",
      fr: "Quelles sont les questions les plus fréquemment posées ?",
      ar: "ما هي الأسئلة الشائعة والأكثر تكراراً؟"
    }
  }
];

export const Chatbot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);

  const handleQuickOption = async (option) => {
    if (loading) return;

    const displayLabel = option.labels[language] || option.labels.en;
    const actualQuery = option.query[language] || option.query.en;

    setMessages(prev => [...prev, { sender: 'user', text: displayLabel }]);
    setLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.sender,
        content: msg.text
      }));

      const res = await axios.post('/api/chat', {
        message: actualQuery,
        history: chatHistory,
        language: language
      });

      setMessages(prev => [...prev, { sender: 'assistant', text: res.data.reply }]);
    } catch (err) {
      console.error("Chatbot Quick Option Error:", err);
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
        {isOpen ? <X size={20} strokeWidth={1.5} /> : <Coffee size={24} strokeWidth={1} />}
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
                <h3>Elysia</h3>
                <span className="chatbot-status">{statusLabel[language] || statusLabel.en}</span>
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

            {/* Quick Suggestions Chips */}
            <AnimatePresence>
              {showOptions && (
                <motion.div 
                  className="chatbot-suggestions-container"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  {quickOptions.map(opt => (
                    <button
                      key={opt.id}
                      className="chatbot-suggestion-chip"
                      onClick={() => handleQuickOption(opt)}
                      disabled={loading}
                    >
                      {opt.labels[language] || opt.labels.en}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form className="chatbot-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder={placeholders[language] || placeholders.en}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowOptions(!showOptions)} 
                className={`chatbot-toggle-options-btn ${showOptions ? 'active' : ''}`}
                aria-label="Toggle suggestions"
              >
                <Sparkles size={16} strokeWidth={1.5} />
              </button>
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
