import React, { useEffect, useState } from 'react';
import {
  FiImage, FiCircle, FiDroplet, FiPenTool, FiSun,
  FiZoomIn, FiLayers, FiFeather, FiRefreshCw,
  FiThermometer, FiWind, FiAperture, FiSliders
} from 'react-icons/fi';

const ICON_MAP = {
  FiImage, FiCircle, FiDroplet, FiPenTool, FiSun,
  FiZoomIn, FiLayers, FiFeather, FiRefreshCw,
  FiThermometer, FiWind, FiAperture,
};

const DEFAULT_FILTERS = [
  { id: 'original',  name: 'Original',     icon: 'FiImage' },
  { id: 'grayscale', name: 'Noir & Blanc',  icon: 'FiCircle' },
  { id: 'blur',      name: 'Flou',          icon: 'FiDroplet' },
  { id: 'edges',     name: 'Contours',      icon: 'FiPenTool' },
  { id: 'sepia',     name: 'Sépia',         icon: 'FiSun' },
  { id: 'sharpen',   name: 'Netteté',       icon: 'FiZoomIn' },
  { id: 'emboss',    name: 'Emboss',        icon: 'FiLayers' },
  { id: 'cartoon',   name: 'Cartoon',       icon: 'FiFeather' },
  { id: 'invert',    name: 'Négatif',       icon: 'FiRefreshCw' },
  { id: 'warm',      name: 'Chaud',         icon: 'FiThermometer' },
  { id: 'cool',      name: 'Froid',         icon: 'FiWind' },
  { id: 'vignette',  name: 'Vignette',      icon: 'FiAperture' },
];

export default function FilterSelector({ activeFilter, onSelect, disabled }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    fetch('http://localhost:8084/filters')
      .then(r => r.json())
      .then(d => setFilters(d.filters))
      .catch(() => {});
  }, []);

  return (
    <div className="glass" style={{ padding: '24px', height: '100%' }}>
      <div className="sec-label">
        <FiSliders size={12} color="rgba(255,255,255,0.42)" />
        Choisir un filtre
        {disabled && (
          <span style={{
            marginLeft: 'auto',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            Charge une image d'abord
          </span>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
        gap: '10px',
      }}>
        {filters.map((f, i) => {
          const Icon = ICON_MAP[f.icon];
          const active = activeFilter === f.id;
          return (
            <button
              key={f.id}
              className={`filter-btn${active ? ' active' : ''}${disabled ? ' disabled' : ''}`}
              style={{ animationDelay: `${i * 30}ms` }}
              onClick={() => !disabled && onSelect(f.id)}
            >
              {Icon && (
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '12px',
                  background: active ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.22s ease',
                }}>
                  <Icon size={16} color={active ? '#fff' : 'rgba(255,255,255,0.65)'} />
                </div>
              )}
              <span style={{
                fontSize: '0.72rem',
                fontWeight: active ? '600' : '400',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                lineHeight: 1.2,
                transition: 'all 0.22s ease',
              }}>
                {f.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}