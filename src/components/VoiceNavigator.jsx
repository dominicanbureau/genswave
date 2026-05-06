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
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  console.log('VoiceNavigator rendered', { isOpen, isListening, transcript, status });

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
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
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Clear timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setStatus('idle');
        }
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
          resolve();
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          setStatus('idle');
          resolve();
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const startListening = async () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      
      // First, greet the user
      await speak('¿Qué te gustaría hacer el día de hoy?');
      
      // Wait a bit more before starting to listen
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Then start listening
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        }
      } catch (error) {
        console.error('Error starting recognition:', error);
        // If already started, stop and restart
        if (error.message && error.message.includes('already started')) {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.error('Error restarting recognition:', e);
            }
          }, 100);
        }
      }
    }
  };

  const processCommand = async (command) => {
    setStatus('processing');
    const lowerCommand = command.toLowerCase();
    
    let destination = null;
    let response = '';

    // Analyze command and determine destination
    if (lowerCommand.includes('servicio') || lowerCommand.includes('servicios')) {
      destination = '/servicios';
      response = 'Te llevaré a la página de servicios';
    } else if (lowerCommand.includes('proceso') || lowerCommand.includes('procesos')) {
      destination = '/proceso';
      response = 'Te llevaré a la página de proceso';
    } else if (lowerCommand.includes('contacto') || lowerCommand.includes('contactar') || lowerCommand.includes('contacta')) {
      destination = '/contacto';
      response = 'Te llevaré a la página de contacto';
    } else if (lowerCommand.includes('inicio') || lowerCommand.includes('home') || lowerCommand.includes('principal')) {
      destination = '/';
      response = 'Te llevaré a la página de inicio';
    } else if (lowerCommand.includes('login') || lowerCommand.includes('iniciar sesión') || lowerCommand.includes('entrar')) {
      destination = '/login';
      response = 'Te llevaré al inicio de sesión';
    } else if (lowerCommand.includes('privacidad')) {
      destination = '/privacidad';
      response = 'Te llevaré a la política de privacidad';
    } else if (lowerCommand.includes('términos') || lowerCommand.includes('terminos')) {
      destination = '/terminos';
      response = 'Te llevaré a los términos y condiciones';
    } else if (lowerCommand.includes('cookies')) {
      destination = '/cookies';
      response = 'Te llevaré a la política de cookies';
    } else if (lowerCommand.includes('preguntas') || lowerCommand.includes('faq')) {
      destination = '/preguntas-frecuentes';
      response = 'Te llevaré a las preguntas frecuentes';
    } else {
      response = 'Lo siento, no entendí tu solicitud. Puedes pedirme que te lleve a servicios, proceso, contacto, o inicio';
    }

    // Speak the response
    await speak(response);
    
    // Navigate if destination was found
    if (destination) {
      setTimeout(() => {
        setIsOpen(false);
        navigate(destination);
      }, 500);
    } else {
      setStatus('idle');
      setTranscript('');
    }
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
