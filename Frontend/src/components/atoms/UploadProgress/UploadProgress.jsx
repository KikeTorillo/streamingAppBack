// src/components/atoms/UploadProgress/UploadProgress.jsx
import React from "react";
import "./UploadProgress.css";

const UploadProgress = ({ 
  progress = 0, 
  message = "Procesando...",
  status = "processing", // 'processing', 'transcoding', 'completed', 'failed'
  showPercentage = true,
  size = "md" // 'sm', 'md', 'lg'
}) => (
  <div className={`upload-progress upload-progress--${size} upload-progress--${status}`}>
    
    {/* Texto de estado */}
    <div className="upload-progress__message">
      {message}
    </div>
    
    {/* Animación de puntos */}
    {(status === 'processing' || status === 'transcoding') && (
      <div className="upload-progress__dots">
        <span className="upload-progress__dot"></span>
        <span className="upload-progress__dot"></span>
        <span className="upload-progress__dot"></span>
      </div>
    )}
    
    {/* Barra de progreso */}
    <div className="upload-progress__bar-container">
      <div 
        className="upload-progress__bar" 
        style={{ width: `${Math.min(progress, 100)}%` }}
      >
        {/* Efectos de barras blancas animadas */}
        <div className="upload-progress__shimmer">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="upload-progress__shimmer-bar"></div>
          ))}
        </div>
      </div>
    </div>
    
    {/* Porcentaje */}
    {showPercentage && (
      <div className="upload-progress__percentage">
        {Math.round(progress)}%
      </div>
    )}
    
    {/* Iconos de estado */}
    <div className="upload-progress__icon">
      {status === 'processing' && '⚙️'}
      {status === 'transcoding' && '🎬'}
      {status === 'completed' && '✅'}
      {status === 'failed' && '❌'}
    </div>
    
  </div>
);

export { UploadProgress };