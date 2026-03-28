import { useRef, useEffect, useState } from 'react';
import './Hero.css';

function Hero() {
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.defaultMuted = true;
      
      // Reproducir automáticamente
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playing successfully');
          })
          .catch((error) => {
            console.log('Autoplay prevented:', error);
            setTimeout(() => {
              video.play().catch(() => {});
            }, 100);
          });
      }

      // Cuando el video termina, pausar en el último frame
      const handleVideoEnd = () => {
        video.pause();
        setVideoEnded(true);
      };

      video.addEventListener('ended', handleVideoEnd);

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  return (
    <>
      <div className="noise"></div>

      {/* Threshold Filter for Morph Effect */}
      <svg className="filters">
        <defs>
          <filter id="threshold">
            {/* Alpha thresholding */}
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 25 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <section className="hero">
        <div className="morph-container">
          <div className="word-rotator">
            <div className="word word-video">
              <video 
                ref={videoRef}
                className="hero-video-element"
                muted
                defaultMuted
                playsInline
                preload="auto"
              >
                <source src="/genswave.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="word">GENSWAVE</div>
          </div>
        </div>
        <p className="subtext">Desarrollo Digital de Próxima Generación</p>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="content-text">
          <h2>Construimos Legados<br />Digitales.</h2>
          <p>
            En un mundo de ruido, creamos claridad. Nuestro estudio fusiona visión estratégica
            con diseño impecable para forjar productos digitales que resisten el paso del tiempo
            y definen el futuro de la interacción.
          </p>
        </div>
        <div className="card">
          <h3>Artesanía Visionaria</h3>
          <br />
          <p style={{ marginBottom: 0 }}>
            No perseguimos tendencias; las establecemos. Al deconstruir problemas complejos
            en soluciones elegantes, empoderamos a las marcas para conectar con su audiencia
            de formas significativas y duraderas.
          </p>
        </div>
      </section>
    </>
  );
}

export default Hero;
