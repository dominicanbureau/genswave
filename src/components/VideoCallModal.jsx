import { motion, AnimatePresence } from 'framer-motion';
import VideoCall from './VideoCall';
import './VideoCallModal.css';

function VideoCallModal({ isOpen, onClose, roomName, userName }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="video-call-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="video-call-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="video-call-header">
            <h3>Videoconferencia - {roomName}</h3>
            <button onClick={onClose} className="close-modal-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <VideoCall 
            roomName={roomName}
            userName={userName}
            onClose={onClose}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default VideoCallModal;