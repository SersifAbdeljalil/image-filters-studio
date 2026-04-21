import React, { useEffect, useState } from 'react';
import { FiDownload, FiClock, FiMaximize, FiSliders, FiBarChart2 } from 'react-icons/fi';

const filterLabels = {
  original: 'Original', grayscale: 'Noir & Blanc', blur: 'Flou Gaussien',
  edges: 'Contours', sepia: 'Sépia', sharpen: 'Netteté',
  emboss: 'Emboss', cartoon: 'Cartoon', invert: 'Négatif',
  warm: 'Chaud', cool: 'Froid', vignette: 'Vignette',
};

function AnimatedNumber({ target, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 24;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.round(start));
    }, 18);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val}{suffix}</>;
}

function StatCard({ icon, value, label, color, suffix, delay }) {
  return (
    <div
      className="anim-up"
      style={{
        animationDelay: delay,
        flex: 1,
        minWidth: '110px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'all 0.22s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{
        width: '30px', height: '30px',
        borderRadius: '10px',
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {React.cloneElement(icon, { size: 14, color })}
      </div>
      <div style={{ fontSize: '1.45rem', fontWeight: '600', color: '#fff', lineHeight: 1 }}>
        <AnimatedNumber target={typeof value === 'number' ? value : 0} suffix={suffix} />
        {typeof value === 'string' && value}
      </div>
      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.42)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsBar({ stats, filtered }) {
  if (!stats) return null;

  const speedColor = stats.time < 100 ? '#6ddc82' : stats.time < 500 ? '#facc15' : '#f87171';

  const handleDownload = () => {
    if (!filtered) return;
    const a = document.createElement('a');
    a.href = filtered;
    a.download = `filtered_${stats.filter}_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="glass" style={{ padding: '22px 24px' }}>
      <div className="sec-label">
        <FiBarChart2 size={12} color="rgba(255,255,255,0.42)" />
        Statistiques du traitement
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch', flexWrap: 'wrap' }}>

        <StatCard
          icon={<FiClock />}
          value={stats.time}
          suffix=" ms"
          label="Traitement"
          color={speedColor}
          delay="0ms"
        />
        <StatCard
          icon={<FiMaximize />}
          value={stats.width}
          suffix=" px"
          label="Largeur"
          color="#78aaff"
          delay="60ms"
        />
        <StatCard
          icon={<FiMaximize />}
          value={stats.height}
          suffix=" px"
          label="Hauteur"
          color="#78aaff"
          delay="100ms"
        />
        <StatCard
          icon={<FiSliders />}
          value={filterLabels[stats.filter] || stats.filter}
          label="Filtre actif"
          color="#c4a8ff"
          delay="140ms"
        />

        {/* Download button */}
        {filtered && (
          <div className="anim-up" style={{
            animationDelay: '200ms',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
          }}>
            <button className="download-btn" onClick={handleDownload} style={{ gap: '10px' }}>
              <FiDownload size={16} />
              Télécharger l'image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}