import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './VoiceNavigator.css';

function VoiceNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  const [agentMessage, setAgentMessage] = useState('');
  const [micPermission, setMicPermission] = useState(null); // null, 'granted', 'denied'
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  console.log('VoiceNavigator rendered', { isOpen, isListening, transcript, status });

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported in this browser');
      setAgentMessage('Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome o Safari.');
      return;
    }
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after getting result
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log('Recognition started');
        setIsListening(true);
        setStatus('listening');
        
        // Set timeout to stop listening after 10 seconds if no speech detected
        timeoutRef.current = setTimeout(() => {
          console.log('Timeout: No speech detected after 10 seconds');
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
          setIsListening(false);
          setStatus('idle');
          speak('No escuché nada. Intenta de nuevo cuando estés listo.');
        }, 10000);
      };

      recognitionRef.current.onresult = (event) => {
        console.log('Recognition result:', event);
        
        // Clear timeout since we got a result
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }

        // Update transcript in real-time
        const currentTranscript = finalTranscript || interimTranscript;
        console.log('Transcript:', currentTranscript);
        setTranscript(currentTranscript);
        
        // If we have a final result, process it
        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript);
          setIsListening(false);
          processCommand(finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Recognition ended');
        setIsListening(false);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // If we have a transcript but haven't processed it yet, process it now
        if (transcript && status === 'listening') {
          processCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event);
        setIsListening(false);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        // Show specific error messages
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setAgentMessage('Permiso de micrófono denegado. Por favor, permite el acceso en la configuración.');
          setMicPermission('denied');
        } else if (event.error === 'no-speech') {
          setAgentMessage('No detecté ninguna voz. Intenta de nuevo.');
        } else if (event.error === 'audio-capture') {
          setAgentMessage('No se pudo acceder al micrófono. Verifica que esté conectado.');
        } else if (event.error === 'network') {
          setAgentMessage('Error de red. Verifica tu conexión a internet.');
        } else if (event.error !== 'aborted') {
          setAgentMessage('Error al escuchar. Por favor, intenta de nuevo.');
        }
        
        setStatus('idle');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const speak = (text) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Set agent message to display above modal
        setAgentMessage(text);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        utterance.onstart = () => {
          setIsSpeaking(true);
          setStatus('speaking');
        };
        
        utterance.onend = () => {
          setIsSpeaking(false);
          setStatus('idle');
          // Clear agent message after speaking
          setTimeout(() => setAgentMessage(''), 2000);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          setStatus('idle');
          setTimeout(() => setAgentMessage(''), 2000);
          resolve();
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Just show the message if speech synthesis not available
        setAgentMessage(text);
        setTimeout(() => {
          setAgentMessage('');
          resolve();
        }, 3000);
      }
    });
  };

  const startListening = async () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      
      // Request microphone permission explicitly
      try {
        console.log('Requesting microphone permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone permission granted');
        // Permission granted, stop the stream
        stream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
        
        // First, greet the user
        await speak('¿Qué te gustaría hacer el día de hoy?');
        
        // Wait a bit more before starting to listen
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Then start listening
        try {
          console.log('Starting speech recognition...');
          if (recognitionRef.current) {
            recognitionRef.current.start();
            console.log('Speech recognition started successfully');
          }
        } catch (error) {
          console.error('Error starting recognition:', error);
          // If already started, stop and restart
          if (error.message && error.message.includes('already started')) {
            console.log('Recognition already started, restarting...');
            recognitionRef.current.stop();
            setTimeout(() => {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.error('Error restarting recognition:', e);
                setAgentMessage('Error al iniciar el reconocimiento de voz. Por favor, intenta de nuevo.');
                setStatus('idle');
              }
            }, 100);
          } else {
            setAgentMessage('Error al iniciar el reconocimiento de voz. Por favor, intenta de nuevo.');
            setStatus('idle');
          }
        }
      } catch (error) {
        console.error('Microphone permission denied:', error);
        setMicPermission('denied');
        setAgentMessage('Necesito permiso para usar el micrófono. Por favor, permite el acceso en la configuración de tu navegador.');
        setStatus('idle');
      }
    }
  };

  const processCommand = async (command) => {
    setStatus('processing');
    const lowerCommand = command.toLowerCase();
    
    let destination = null;
    let response = '';
    let action = null;

    // Use AI to understand the intent
    try {
      const aiResponse = await fetch('/api/ai-assistant/voice-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
          context: {
            currentUrl: window.location.pathname,
            timestamp: new Date().toISOString()
          }
        }),
      });

      const data = await aiResponse.json();
      
      if (data.success && data.intent) {
        destination = data.intent.destination;
        response = data.intent.response;
        action = data.intent.action;
      } else {
        // Fallback to rule-based system
        const result = analyzeCommandLocally(lowerCommand);
        destination = result.destination;
        response = result.response;
        action = result.action;
      }
    } catch (error) {
      console.error('Error processing with AI:', error);
      // Fallback to rule-based system
      const result = analyzeCommandLocally(lowerCommand);
      destination = result.destination;
      response = result.response;
      action = result.action;
    }

    // Speak the response
    await speak(response);
    
    // Execute action
    if (action === 'openChat') {
      // Open AI chat assistant
      setTimeout(() => {
        setIsOpen(false);
        // Trigger AI chat button click
        const aiChatButton = document.querySelector('.ai-assistant-button');
        if (aiChatButton) {
          aiChatButton.click();
        }
      }, 500);
    } else if (action === 'mailto') {
      // Open email client
      setTimeout(() => {
        setIsOpen(false);
        window.location.href = 'mailto:support@genswave.org';
      }, 500);
    } else if (action === 'instagram') {
      // Open Instagram
      setTimeout(() => {
        setIsOpen(false);
        window.open('https://instagram.com/genswave', '_blank');
      }, 500);
    } else if (destination) {
      // Navigate to destination
      setTimeout(() => {
        setIsOpen(false);
        navigate(destination);
      }, 500);
    } else {
      setStatus('idle');
      setTranscript('');
    }
  };

  const analyzeCommandLocally = (lowerCommand) => {
    let destination = null;
    let response = '';
    let action = null;

    // Registration / Auth
    if (lowerCommand.includes('registr') || lowerCommand.includes('crear cuenta') || 
        lowerCommand.includes('sign up') || lowerCommand.includes('cuenta nueva')) {
      destination = '/login';
      response = 'Te llevaré al registro';
    }
    // Login / Auth
    else if (lowerCommand.includes('login') || lowerCommand.includes('iniciar sesión') || 
             lowerCommand.includes('entrar') || lowerCommand.includes('autenticar')) {
      destination = '/login';
      response = 'Te llevaré al inicio de sesión';
    }
    // Services
    else if (lowerCommand.includes('servicio') || lowerCommand.includes('servicios') ||
             lowerCommand.includes('qué hacen') || lowerCommand.includes('que ofrecen')) {
      destination = '/servicios';
      response = 'Te llevaré a nuestros servicios';
    }
    // Process
    else if (lowerCommand.includes('proceso') || lowerCommand.includes('procesos') ||
             lowerCommand.includes('cómo trabajan') || lowerCommand.includes('metodología')) {
      destination = '/proceso';
      response = 'Te llevaré a nuestro proceso de trabajo';
    }
    // Contact
    else if (lowerCommand.includes('contacto') || lowerCommand.includes('contactar') || 
             lowerCommand.includes('contacta') || lowerCommand.includes('hablar con')) {
      destination = '/contacto';
      response = 'Te llevaré a la página de contacto';
    }
    // Email
    else if (lowerCommand.includes('correo') || lowerCommand.includes('email') || 
             lowerCommand.includes('enviar mensaje') || lowerCommand.includes('escribir')) {
      action = 'mailto';
      response = 'Abriendo tu cliente de correo';
    }
    // Instagram
    else if (lowerCommand.includes('instagram') || lowerCommand.includes('ig') || 
             lowerCommand.includes('redes sociales') || lowerCommand.includes('social')) {
      action = 'instagram';
      response = 'Abriendo nuestro Instagram';
    }
    // Help / Support / Questions
    else if (lowerCommand.includes('ayuda') || lowerCommand.includes('soporte') || 
             lowerCommand.includes('pregunta') || lowerCommand.includes('duda') ||
             lowerCommand.includes('consulta') || lowerCommand.includes('asistencia') ||
             lowerCommand.includes('necesito') || lowerCommand.includes('problema')) {
      action = 'openChat';
      response = 'Abriendo el chat de soporte para ayudarte';
    }
    // Home
    else if (lowerCommand.includes('inicio') || lowerCommand.includes('home') || 
             lowerCommand.includes('principal') || lowerCommand.includes('portada')) {
      destination = '/';
      response = 'Te llevaré a la página de inicio';
    }
    // Privacy
    else if (lowerCommand.includes('privacidad') || lowerCommand.includes('datos') ||
             lowerCommand.includes('información personal')) {
      destination = '/privacidad';
      response = 'Te llevaré a la política de privacidad';
    }
    // Terms
    else if (lowerCommand.includes('términos') || lowerCommand.includes('terminos') ||
             lowerCommand.includes('condiciones') || lowerCommand.includes('legal')) {
      destination = '/terminos';
      response = 'Te llevaré a los términos y condiciones';
    }
    // Cookies
    else if (lowerCommand.includes('cookies') || lowerCommand.includes('galletas')) {
      destination = '/cookies';
      response = 'Te llevaré a la política de cookies';
    }
    // FAQ
    else if (lowerCommand.includes('preguntas frecuentes') || lowerCommand.includes('faq') ||
             lowerCommand.includes('preguntas comunes')) {
      destination = '/preguntas-frecuentes';
      response = 'Te llevaré a las preguntas frecuentes';
    }
    // Default
    else {
      action = 'openChat';
      response = 'No estoy seguro de entender. Te abriré el chat para que puedas hablar con nuestro asistente';
    }

    return { destination, response, action };
  };

  const handleOpen = () => {
    console.log('Opening voice navigator modal');
    setIsOpen(true);
    // Start listening automatically after modal opens
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const handleClose = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsOpen(false);
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript('');
    setStatus('idle');
  };

  return (
    <>
      {/* Floating Microphone Button */}
      <motion.button
        className="voice-navigator-button"
        onClick={handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </motion.button>

      {/* Voice Navigator Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="voice-navigator-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Agent Message - Above Modal */}
            <AnimatePresence>
              {agentMessage && (
                <motion.div
                  className="voice-agent-message"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{agentMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal */}
            <motion.div
              className="voice-navigator-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Close Button */}
              <button className="voice-close-btn" onClick={handleClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>

              {/* Animated Microphone Icon */}
              <div className="voice-icon-container">
                <motion.div
                  className={`voice-icon ${status}`}
                  animate={{
                    scale: isListening ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isListening ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </motion.div>

                {/* Pulse Rings */}
                {isListening && (
                  <>
                    <motion.div
                      className="pulse-ring"
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      className="pulse-ring"
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                  </>
                )}
              </div>

              {/* Status Text */}
              <motion.div
                className="voice-status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {status === 'idle' && <p>Listo para escuchar</p>}
                {status === 'speaking' && <p>Hablando...</p>}
                {status === 'listening' && <p>Escuchando...</p>}
                {status === 'processing' && <p>Procesando...</p>}
              </motion.div>

              {/* Manual start button if not listening */}
              {!isListening && !isSpeaking && status === 'idle' && micPermission !== 'denied' && (
                <motion.button
                  className="voice-start-button"
                  onClick={startListening}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Iniciar escucha
                </motion.button>
              )}

              {/* Transcript Display - Always visible when listening */}
              <AnimatePresence>
                {(transcript || isListening) && (
                  <motion.div
                    className="voice-transcript"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <p>{transcript || 'Escuchando...'}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default VoiceNavigator;
