import React, { useEffect, useState } from 'react';
import { FiCamera, FiZap, FiStar } from 'react-icons/fi';

const styles = {
  wrapper: {
    padding: '36px 0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  iconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.22)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 3s ease infinite',
    flexShrink: 0,
  },
  titleBlock: {},
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: '2rem',
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: '-0.5px',
    lineHeight: 1.1,
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '400',
    letterSpacing: '0.3px',
  },
  pills: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '50px',
    fontSize: '0.76rem',
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    letterSpacing: '0.3px',
    transition: 'all 0.22s ease',
    cursor: 'default',
  },
};

const pillHoverStyle = {
  background: 'rgba(255,255,255,0.14)',
  borderColor: 'rgba(255,255,255,0.28)',
  color: '#fff',
};

function Pill({ icon, label, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="anim-up"
      style={{ ...styles.pill, ...(hover ? pillHoverStyle : {}), animationDelay: delay }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon}
      {label}
    </div>
  );
}

export default function Header() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <div style={styles.iconWrap}>
          <FiCamera size={26} color="rgba(255,255,255,0.9)" />
        </div>
        <div style={styles.titleBlock}>
          <h1 style={styles.title}>Image Filters Studio</h1>
          <p style={styles.subtitle}>Traitement d'image temps réel · OpenCV · React · FastAPI</p>
        </div>
      </div>
      <div style={styles.pills}>
        <Pill icon={<FiZap size={12}/>} label="12 filtres" delay="150ms" />
        <Pill icon={<FiStar size={12}/>} label="Glassmorphisme" delay="220ms" />
        <Pill icon={<FiCamera size={12}/>} label="Avant / Après" delay="290ms" />
      </div>
    </div>
  );
}