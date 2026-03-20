// Ejemplo de cómo usar el componente de videoconferencia
import { useState } from 'react';
import VideoCallModal from './components/VideoCallModal';

function ExampleUsage() {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [user, setUser] = useState({ name: 'Miguel A.' }); // Tu usuario actual

  const startVideoCall = () => {
    setShowVideoCall(true);
  };

  const closeVideoCall = () => {
    setShowVideoCall(false);
  };

  return (
    <div>
      {/* Botón para iniciar videoconferencia */}
      <button onClick={startVideoCall} className="video-call-btn">
        📹 Iniciar Videoconferencia
      </button>

      {/* Modal de videoconferencia */}
      <VideoCallModal
        isOpen={showVideoCall}
        onClose={closeVideoCall}
        roomName={`genswave-meeting-${Date.now()}`} // Sala única
        userName={user.name}
      />
    </div>
  );
}

export default ExampleUsage;