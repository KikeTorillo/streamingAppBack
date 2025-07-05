import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector/dist/videojs-hls-quality-selector.css";
import hlsQualitySelector from "videojs-hls-quality-selector";
import "./VideoPlayer.css";
import { useParams, useSearchParams } from 'react-router-dom';

// Registra los plugins si aún no están registrados
if (typeof videojs.getPlugin("hlsQualitySelector") !== "function") {
  videojs.registerPlugin("hlsQualitySelector", hlsQualitySelector);
}

const VideoPlayer = () => {
  const {movieId} = useParams(); // ✅ FIX: Cambiar de "id" a "movieId"
  const [searchParams] = useSearchParams();
  const resolutions = searchParams.get('resolutions');
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // ✅ FIX: URL corregida sin puerto duplicado
  const cdnUrl = import.meta.env.VITE_CDN_URL || 'http://localhost:8082';
  const baseUrl = `${cdnUrl}/hls/${movieId}/`;
  const subsUrl = `${cdnUrl}/subs/${movieId}/`;
  
  // ✅ FIX: Validar que movieId y resolutions existen
  if (!movieId) {
    console.error('VideoPlayer: movieId no encontrado en la URL');
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Error: ID de video no encontrado</h2>
        <p>Verifica que la URL sea correcta</p>
      </div>
    );
  }

  if (!resolutions) {
    console.error('VideoPlayer: Resolutions no encontradas en la URL');
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Error: Resoluciones no encontradas</h2>
        <p>Verifica que la URL contenga parámetros de resolución</p>
      </div>
    );
  }

  const urlComplete = `${baseUrl}_,${resolutions},p.mp4.play/master.m3u8`;
  
  console.log("VideoPlayer - movieId:", movieId);
  console.log("VideoPlayer - Resolutions:", resolutions);
  console.log("VideoPlayer - URL Completa:", urlComplete);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        if (!videoRef.current) {
          console.error("El elemento <video> no está disponible en el DOM.");
          return;
        }
        
        if (playerRef.current) {
          playerRef.current.dispose();
        }

        const player = videojs(videoRef.current, {
          controls: true,
          autoplay: false,
          preload: "auto",
          fluid: true,
          sources: [
            {
              src: urlComplete,
              type: "application/x-mpegURL",
            },
          ],
          html5: {
            vhs: {
              overrideNative: true,
            },
            nativeControlsForTouch: false,
            playsinline: true,
          },
          pip: true,
          controlBar: {
            children: [
              "playToggle",
              "volumePanel",
              "currentTimeDisplay",
              "timeDivider",
              "durationDisplay",
              "progressControl",
              "remainingTimeDisplay",
              "audioTrackButton",
              "subsCapsButton",
              "pictureInPictureToggle",
              "fullscreenToggle",
            ],
          },
        });

        // Habilita selección de calidad
        player.hlsQualitySelector({
          displayCurrentQuality: true,
        });

        // Habilita selección de pistas de audio
        player.on("loadedmetadata", () => {
          const audioTracks = player.audioTracks();
          if (audioTracks.length > 0) {
            console.log("Pistas de audio detectadas:", audioTracks);
          }
        });

        // ✅ FIX: Manejo de errores mejorado
        player.on('error', (e) => {
          console.error('VideoJS Error:', e);
          const error = player.error();
          if (error) {
            console.error('Error details:', error);
          }
        });

        playerRef.current = player;
        
      } catch (error) {
        console.error("Error al inicializar el reproductor:", error);
      }
    };

    initializePlayer();
    
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [urlComplete]); // ✅ FIX: Dependencia corregida

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Reproduciendo video</h2>
      <p>Movie ID: {movieId}</p>
      <p>Resoluciones: {resolutions}</p>
      
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
          controls
          width="640"
          height="360"
          style={{ maxWidth: "100%", height: "auto" }}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
    </div>
  );
};

export { VideoPlayer };