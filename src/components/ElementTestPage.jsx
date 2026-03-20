import { useState } from 'react';
import VideoCallModal from './VideoCallModal';
import './ElementTestPage.css';

function ElementTestPage() {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('Miguel A.');

  const startElementMeeting = () => {
    const finalRoomName = roomName.trim() || `genswave-test-${Date.now()}`;
    setRoomName(finalRoomName);
    setShowVideoCall(true);
  };

  const closeVideoCall = () => {
    setShowVideoCall(false);
  };

  return (
    <div className="element-test-page">
      <div className="test-container">
        <h1>🎬 Prueba de Element Meeting</h1>
        <p>Probemos meet.element.io como alternativa a ffmuc</p>
        
        <div className="test-form">
          <div className="form-group">
            <label>Nombre de usuario:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          
          <div className="form-group">
            <label>Nombre de la sala (opcional):</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Deja vacío para generar automáticamente"
            />
          </div>
          
          <button 
            onClick={startElementMeeting}
            className="start-meeting-btn"
            disabled={!userName.trim()}
          >
            🚀 Iniciar Meeting con Element
          </button>
        </div>
        
        <div className="info-section">
          <h3>ℹ️ Información sobre Element:</h3>
          <ul>
            <li>✅ No requiere login ni registro</li>
            <li>✅ Basado en Matrix (protocolo descentralizado)</li>
            <li>✅ Mejor privacidad que Jitsi tradicional</li>
            <li>✅ Interfaz limpia y profesional</li>
            <li>✅ Soporte completo para screen sharing</li>
            <li>✅ Chat integrado</li>
          </ul>
        </div>
        
        <div className="fallback-info">
          <h3>🔄 Sistema de Fallback:</h3>
          <p>Si Element falla, automáticamente probará:</p>
          <ol>
            <li>meet.element.io (Principal)</li>
            <li>meet.jit.si (Backup 1)</li>
            <li>8x8.vc (Backup 2)</li>
            <li>jitsi.riot.im (Backup 3)</li>
          </ol>
        </div>
      </div>

      <VideoCallModal
        isOpen={showVideoCall}
        onClose={closeVideoCall}
        roomName={roomName}
        userName={userName}
      />
    </div>
  );
}

export default ElementTestPage;