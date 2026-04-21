import React, { useRef, useState } from 'react';
import { FiUploadCloud, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

const css = `
  @keyframes dash {
    to { stroke-dashoffset: -20; }
  }
  .drop-border {
    stroke-dasharray: 8 4;
    animation: dash 1.6s linear infinite;
  }
`;

export default function ImageUploader({ onUpload, hasImage }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => onUpload(file, e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="glass" style={{ padding: '24px', height: '100%' }}>
      <style>{css}</style>

      <div className="sec-label">
        <FiUploadCloud size={12} color="rgba(255,255,255,0.42)" />
        Charger une image
      </div>

      {hasImage ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          padding: '28px 16px',
          background: 'rgba(100,220,130,0.08)',
          border: '1px solid rgba(100,220,130,0.28)',
          borderRadius: '16px',
          textAlign: 'center',
          animation: 'fadeIn 0.4s ease',
        }}>
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            background: 'rgba(100,220,130,0.15)',
            border: '1px solid rgba(100,220,130,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiCheckCircle size={22} color="#6ddc82" />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: '500', marginBottom: '4px' }}>
              Image chargée
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              {fileName || 'Prête pour les filtres'}
            </div>
          </div>
          <button
            className="download-btn"
            style={{ fontSize: '0.78rem', padding: '8px 18px' }}
            onClick={() => inputRef.current.click()}
          >
            <FiRefreshCw size={13} /> Changer
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{
            position: 'relative',
            borderRadius: '16px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
            transition: 'all 0.25s ease',
            transform: dragging ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          {/* SVG dashed border */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <rect
              x="1" y="1"
              width="calc(100% - 2px)" height="calc(100% - 2px)"
              rx="15"
              fill="none"
              stroke={dragging ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)'}
              strokeWidth="1.5"
              className="drop-border"
              style={{ transition: 'stroke 0.25s' }}
            />
          </svg>

          <div style={{
            width: '52px', height: '52px',
            margin: '0 auto 16px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.25s ease',
            transform: dragging ? 'translateY(-4px) scale(1.1)' : 'none',
          }}>
            <FiUploadCloud size={24} color="rgba(255,255,255,0.8)" />
          </div>

          <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '500', marginBottom: '6px' }}>
            Glisse ton image ici
          </div>
          <div style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.78rem', marginBottom: '18px' }}>
            PNG · JPG · WEBP · max 10 MB
          </div>
          <button
            className="download-btn"
            style={{ fontSize: '0.82rem' }}
            onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}
          >
            <FiUploadCloud size={14} /> Parcourir
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}