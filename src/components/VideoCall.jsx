import { useEffect, useRef, useState } from 'react';
import './VideoCall.css';

function VideoCall({ roomName, userName, onClose }) {
  const jitsiContainerRef = useRef(null);
  const [api, setApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lista de servidores Jitsi gratuitos (sin login) - Element como principal
  const jitsiServers = [
    'meet.element.io',
    'meet.jit.si',
    '8x8.vc',
    'jitsi.riot.im'
  ];

  const [currentServerIndex, setCurrentServerIndex] = useState(0);

  useEffect(() => {
    loadJitsiScript();
    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, []);

  const loadJitsiScript = () => {
    // Verificar si ya está cargado
    if (window.JitsiMeetExternalAPI) {
      initializeJitsi();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://${jitsiServers[currentServerIndex]}/external_api.js`;
    script.async = true;
    script.onload = initializeJitsi;
    script.onerror = handleScriptError;
    document.head.appendChild(script);
  };

  const handleScriptError = () => {
    console.log(`Error loading from ${jitsiServers[currentServerIndex]}`);
    
    // Intentar con el siguiente servidor
    if (currentServerIndex < jitsiServers.length - 1) {
      setCurrentServerIndex(prev => prev + 1);
      setTimeout(() => {
        loadJitsiScript();
      }, 1000);
    } else {
      setError('No se pudo conectar a ningún servidor de videoconferencia');
      setIsLoading(false);
    }
  };

  const initializeJitsi = () => {
    try {
      const domain = jitsiServers[currentServerIndex];
      
      // Configuración específica para Element
      const isElement = domain === 'meet.element.io';
      
      const options = {
        roomName: roomName || `genswave-meeting-${Date.now()}`,
        width: '100%',
        height: 600,
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          requireDisplayName: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
          hideConferenceTimer: false,
          enableInsecureRoomNameWarning: false,
          enableClosePage: false,
          enableNoisyMicDetection: true,
          disableDeepLinking: true,
          // Configuraciones específicas para Element
          ...(isElement && {
            enableWelcomePage: false,
            enableUserRolesBasedOnToken: false,
            disableInviteFunctions: false,
            doNotStoreRoom: true,
            disableRemoteMute: false,
            enableLipSync: false
          })
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          SHOW_POWERED_BY: false,
          // Toolbar optimizada para Element
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
          ],
          // Configuraciones específicas para Element
          ...(isElement && {
            MOBILE_APP_PROMO: false,
            NATIVE_APP_NAME: 'Genswave Meeting',
            PROVIDER_NAME: 'Genswave',
            LANG_DETECTION: true,
            CONNECTION_INDICATOR_DISABLED: false
          })
        },
        userInfo: {
          displayName: userName || 'Usuario Genswave',
          email: '' // Element no requiere email
        }
      };

      console.log('🎬 Inicializando con Element/Matrix:', { 
        domain, 
        roomName: options.roomName, 
        userName,
        isElement 
      });

      const jitsiAPI = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners específicos para Element
      jitsiAPI.addEventListener('videoConferenceJoined', (event) => {
        console.log('✅ Unido a Element meeting:', event);
        setIsLoading(false);
        setError(null);
        
        // Configuraciones post-conexión para Element
        if (isElement) {
          // Configurar calidad de video para Element
          jitsiAPI.executeCommand('setVideoQuality', 720);
        }
      });

      jitsiAPI.addEventListener('videoConferenceLeft', () => {
        console.log('👋 Salió de Element meeting');
        if (onClose) onClose();
      });

      jitsiAPI.addEventListener('readyToClose', () => {
        console.log('🔚 Element meeting listo para cerrar');
        if (onClose) onClose();
      });

      // Event listener específico para errores de Element
      jitsiAPI.addEventListener('participantJoined', (event) => {
        console.log('👤 Participante unido a Element:', event.displayName);
      });

      jitsiAPI.addEventListener('participantLeft', (event) => {
        console.log('👤 Participante salió de Element:', event.displayName);
      });

      setApi(jitsiAPI);

    } catch (err) {
      console.error('❌ Error inicializando Element/Jitsi:', err);
      setError(`Error al inicializar la videoconferencia con ${jitsiServers[currentServerIndex]}`);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setCurrentServerIndex(0);
    loadJitsiScript();
  };

  if (error) {
    return (
      <div className="video-call-error">
        <div className="error-content">
          <h3>Error de Conexión</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-btn">
              Reintentar
            </button>
            <button onClick={onClose} className="close-btn">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-call-container">
      {isLoading && (
        <div className="video-call-loading">
          <div className="loading-spinner"></div>
          <p>Conectando a videoconferencia...</p>
          <small>Servidor: {jitsiServers[currentServerIndex]}</small>
        </div>
      )}
      <div 
        ref={jitsiContainerRef} 
        className="jitsi-container"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
}

export default VideoCall;