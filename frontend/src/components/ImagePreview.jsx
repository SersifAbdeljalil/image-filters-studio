import React, { useState } from 'react';
import { FiImage, FiZap, FiMaximize2 } from 'react-icons/fi';

const filterLabels = {
  original: 'Original', grayscale: 'Noir & Blanc', blur: 'Flou Gaussien',
  edges: 'Contours', sepia: 'Sépia', sharpen: 'Netteté',
  emboss: 'Emboss', cartoon: 'Cartoon', invert: 'Négatif',
  warm: 'Chaud', cool: 'Froid', vignette: 'Vignette',
};

function PanelHeader({ dot, title, icon }) {
  return (
    <div style={{
      padding: '11px 16px',
      background: 'rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {icon}
      <span style={{ fontSize: '0.76rem', fontWeight: '500', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.3px' }}>
        {title}
      </span>
    </div>
  );
}

function Placeholder({ text }) {
  return (
    <div style={{
      height: '260px',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '12px',
      color: 'rgba(255,255,255,0.22)',
    }}>
      <div style={{
        width: '48px', height: '48px',
        borderRadius: '14px',
        border: '1px dashed rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FiImage size={20} color="rgba(255,255,255,0.2)" />
      </div>
      <span style={{ fontSize: '0.78rem' }}>{text}</span>
    </div>
  );
}

export default function ImagePreview({ original, filtered, loading, activeFilter }) {
  const [zoom, setZoom] = useState(null);

  return (
    <>
      {/* zoom overlay */}
      {zoom && (
        <div
          onClick={() => setZoom(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <img
            src={zoom}
            alt="zoom"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}
          />
        </div>
      )}

      <div className="glass" style={{ padding: '24px' }}>
        <div className="sec-label">
          <FiImage size={12} color="rgba(255,255,255,0.42)" />
          Aperçu avant / après
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Original */}
          <div style={{
            background: 'rgba(0,0,0,0.28)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <PanelHeader dot="#6ddc82" title="Image originale" icon={<FiImage size={12} color="rgba(255,255,255,0.4)" />} />
            {original ? (
              <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setZoom(original)}>
                <img
                  src={original} alt="Original"
                  style={{ width: '100%', display: 'block', maxHeight: '380px', objectFit: 'contain', background: 'rgba(0,0,0,0.18)' }}
                />
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.45)',
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <FiMaximize2 size={11} color="rgba(255,255,255,0.7)" />
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)' }}>Agrandir</span>
                </div>
              </div>
            ) : <Placeholder text="Aucune image chargée" />}
          </div>

          {/* Filtered */}
          <div style={{
            background: 'rgba(0,0,0,0.28)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
          }}>
            <PanelHeader
              dot="#78aaff"
              title={filterLabels[activeFilter] || activeFilter}
              icon={<FiZap size={12} color="rgba(255,255,255,0.4)" />}
            />
            {filtered ? (
              <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setZoom(filtered)}>
                <img
                  src={filtered} alt="Filtered"
                  style={{ width: '100%', display: 'block', maxHeight: '380px', objectFit: 'contain', background: 'rgba(0,0,0,0.18)', animation: 'fadeIn 0.4s ease' }}
                />
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.45)',
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <FiMaximize2 size={11} color="rgba(255,255,255,0.7)" />
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)' }}>Agrandir</span>
                </div>
              </div>
            ) : <Placeholder text="Sélectionne un filtre" />}

            {/* Loading overlay */}
            {loading && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: '14px',
                animation: 'fadeIn 0.2s ease',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  border: '2.5px solid rgba(255,255,255,0.15)',
                  borderTop: '2.5px solid #ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: '500' }}>
                  Traitement en cours…
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}