import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AIAssistant.css';

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Detect dark mode from localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on mount
    const savedMessages = localStorage.getItem('ai_chat_messages');
    if (savedMessages) {
      try {
        return JSON.parse(savedMessages);
      } catch (e) {
        return [{
          id: 1,
          text: "¡Hola! Soy Genswave, tu asistente virtual. Conozco todo sobre nuestros servicios, procesos y funcionalidades. ¿En qué puedo ayudarte hoy?",
          sender: 'ai',
          timestamp: new Date()
        }];
      }
    }
    return [{
      id: 1,
      text: "¡Hola! Soy Genswave, tu asistente virtual. Conozco todo sobre nuestros servicios, procesos y funcionalidades. ¿En qué puedo ayudarte hoy?",
      sender: 'ai',
      timestamp: new Date()
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [sessionId] = useState(() => {
    // Load or create session ID
    const savedSessionId = localStorage.getItem('ai_chat_session_id');
    if (savedSessionId) {
      return savedSessionId;
    }
    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ai_chat_session_id', newSessionId);
    return newSessionId;
  });
  const [chatActive, setChatActive] = useState(() => {
    // Check if chat is still active
    const savedActive = localStorage.getItem('ai_chat_active');
    return savedActive !== 'false';
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for theme changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setIsDarkMode(e.newValue === 'dark');
      }
    };

    // Also check for theme changes in the same tab
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
    };

    window.addEventListener('storage', handleStorageChange);
    // Check theme periodically in case it changes in the same tab
    const interval = setInterval(checkTheme, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ai_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Mark chat as active when opened
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem('ai_chat_active', 'true');
      setChatActive(true);
    }
  }, [isOpen]);

  // Detect when user closes the page/tab
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // Mark chat as inactive
      localStorage.setItem('ai_chat_active', 'false');
      
      // Notify server that chat is closed
      try {
        await fetch(`/api/ai-assistant/session/${sessionId}/close`, {
          method: 'POST',
          keepalive: true // Ensures request completes even if page is closing
        });
      } catch (error) {
        console.error('Error closing session:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
        // Check if chat is transferred and should be silent
        if (data.transferred && data.silent) {
          setIsTyping(false);
          // Don't add any message, just wait for admin response
          return;
        }

        // Check if chat is transferred (legacy support)
        if (data.transferred) {
          const transferredMessage = {
            id: Date.now() + 1,
            text: data.response,
            sender: 'ai',
            timestamp: new Date(),
            isTransferred: true
          };
          
          setIsTyping(false);
          setMessages(prev => [...prev, transferredMessage]);
          return;
        }

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

  // Poll for new messages from support
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/ai-assistant/session/${sessionId}/messages`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.messages) {
            // Check for new support messages
            const supportMessages = data.messages.filter(msg => 
              msg.sender === 'support' && 
              !messages.some(m => m.id === msg.id)
            );

            if (supportMessages.length > 0) {
              setMessages(prev => {
                const newMessages = [...prev];
                
                // Add system message if this is the first support message
                const hasSystemMessage = prev.some(m => m.isSystemMessage && m.agentName === data.agentName);
                if (!hasSystemMessage && data.agentName) {
                  newMessages.push({
                    id: 'system-' + Date.now(),
                    text: `Estás siendo atendido por ${data.agentName}`,
                    sender: 'system',
                    timestamp: new Date(),
                    isSystemMessage: true,
                    agentName: data.agentName
                  });
                }
                
                supportMessages.forEach(msg => {
                  newMessages.push({
                    id: msg.id,
                    text: msg.message,
                    sender: 'support',
                    timestamp: new Date(msg.created_at),
                    isSupport: true,
                    agentName: msg.agent_name || data.agentName
                  });
                });
                return newMessages;
              });
            }
          }
        }
      } catch (error) {
        console.error('Error polling messages:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [isOpen, sessionId, messages]);

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
    <div className={isDarkMode ? 'dark-mode' : ''}>
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
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
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
                message.sender === 'system' ? (
                  <motion.div
                    key={message.id}
                    className="system-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="system-message-content">
                      {message.text}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={message.id}
                    className={`message ${message.sender === 'support' ? 'support' : message.sender} ${message.isTransferred ? 'transferred' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(message.sender === 'ai' || message.sender === 'support') && (
                      <div className="message-avatar">
                        <img src="/genswave.png" alt="Genswave" />
                        {message.sender === 'support' && (
                          <div className="support-badge" title="Soporte Humano">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="message-content">
                      {message.sender === 'support' && message.agentName && (
                        <div className="agent-name">{message.agentName}</div>
                      )}
                      <div 
                        className="message-text"
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      />
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
                        {message.timestamp && typeof message.timestamp.toLocaleTimeString === 'function' ? (
                          message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        ) : (
                          new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        )}
                        {message.sender === 'support' && (
                          <span className="support-label"> • Soporte</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
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
    </div>
  );
}

export default AIAssistant;