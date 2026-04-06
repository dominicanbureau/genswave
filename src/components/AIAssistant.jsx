import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIAssistant.css';

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy Genswave, tu asistente virtual. Conozco todo sobre nuestros servicios, procesos y funcionalidades. ¿En qué puedo ayudarte hoy?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          sessionId: sessionId,
          context: {
            url: window.location.pathname,
            timestamp: new Date().toISOString()
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'ai',
          timestamp: new Date(),
          actions: data.actions || []
        };

        // Simulate typing delay
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, aiMessage]);

          // Check if AI wants to transfer to human support
          if (data.transferToSupport) {
            setIsTransferring(true);
            setTimeout(() => {
              handleTransferToSupport(userMessage.text);
            }, 1000);
          }
        }, 1000 + Math.random() * 1000);
      } else {
        throw new Error(data.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "Disculpa, estoy experimentando dificultades técnicas. ¿Te gustaría que te conecte con nuestro equipo de soporte humano?",
        sender: 'ai',
        timestamp: new Date(),
        actions: [
          { type: 'transfer', label: 'Hablar con soporte' }
        ]
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleTransferToSupport = async (lastUserMessage) => {
    try {
      const response = await fetch('/api/ai-assistant/transfer-to-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          messages: messages,
          lastMessage: lastUserMessage,
          context: {
            url: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        const transferMessage = {
          id: Date.now() + 2,
          text: "Te he conectado con nuestro equipo de soporte humano. Un agente revisará tu consulta y te responderá pronto. Puedes cerrar este chat y continuar navegando.",
          sender: 'ai',
          timestamp: new Date(),
          isTransferConfirmation: true
        };

        setMessages(prev => [...prev, transferMessage]);
        setIsTransferring(false);
      }
    } catch (error) {
      console.error('Error transferring to support:', error);
      setIsTransferring(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.type === 'transfer') {
      handleTransferToSupport("Usuario solicitó hablar con soporte");
    } else if (action.type === 'navigate') {
      window.location.href = action.url;
    } else if (action.type === 'scroll') {
      const element = document.querySelector(action.selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="ai-assistant-button"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen 
            ? "0 8px 32px rgba(255, 255, 255, 0.1)" 
            : "0 4px 20px rgba(255, 255, 255, 0.15)"
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </motion.svg>
          )}
        </AnimatePresence>
        
        {/* Notification dot for new features */}
        <motion.div
          className="notification-dot"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring" }}
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-assistant-chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="ai-avatar">
                  <img src="/genswave.png" alt="Genswave AI" />
                </div>
                <div className="ai-info">
                  <h3>Genswave</h3>
                  <span className="ai-status">
                    <div className="status-dot"></div>
                    Asistente Virtual
                  </span>
                </div>
              </div>
              <button className="chat-minimize" onClick={toggleChat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {message.sender === 'ai' && (
                    <div className="message-avatar">
                      <img src="/genswave.png" alt="Genswave AI" />
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    {message.actions && message.actions.length > 0 && (
                      <div className="message-actions">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            className="action-button"
                            onClick={() => handleActionClick(action)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="message ai typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    <img src="/genswave.png" alt="Genswave AI" />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Transfer Indicator */}
              {isTransferring && (
                <motion.div
                  className="message ai transferring"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="message-avatar">
                    <img src="/genswave.png" alt="Genswave AI" />
                  </div>
                  <div className="message-content">
                    <div className="transfer-indicator">
                      Conectando con soporte humano...
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <div className="chat-input-container">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="chat-input"
                  disabled={isTyping || isTransferring}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={!inputMessage.trim() || isTyping || isTransferring}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIAssistant;