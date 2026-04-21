import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import FilterSelector from './components/FilterSelector';
import ImagePreview from './components/ImagePreview';
import StatsBar from './components/StatsBar';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 3px; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.18); }
    50%      { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
  }
  @keyframes shimmerBar {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes borderGlow {
    0%,100% { border-color: rgba(255,255,255,0.18); }
    50%      { border-color: rgba(255,255,255,0.45); }
  }

  .anim-up { animation: fadeSlideUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .anim-in  { animation: fadeIn 0.45s ease both; }

  .glass {
    background: rgba(255,255,255,0.09);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 22px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12);
    transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
  }
  .glass:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 44px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18);
    border-color: rgba(255,255,255,0.28);
  }

  .sec-label {
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(255,255,255,0.42);
    letter-spacing: 2.5px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .sec-label::after {
    content:'';
    flex:1;
    height:1px;
    background: linear-gradient(90deg, rgba(255,255,255,0.14), transparent);
  }

  .filter-btn {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 16px;
    padding: 16px 8px 12px;
    cursor: pointer;
    text-align: center;
    transition: all 0.22s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    font-family: inherit;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .filter-btn::before {
    content:'';
    position:absolute;
    inset:0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
    opacity:0;
    transition: opacity 0.22s ease;
  }
  .filter-btn:hover::before { opacity:1; }
  .filter-btn:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.32);
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  }
  .filter-btn.active {
    background: rgba(255,255,255,0.22);
    border-color: rgba(255,255,255,0.6);
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(255,255,255,0.12);
    animation: pulse 2.5s ease infinite;
  }
  .filter-btn:disabled, .filter-btn.disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none !important;
  }

  .download-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 26px;
    background: rgba(255,255,255,0.16);
    border: 1px solid rgba(255,255,255,0.32);
    border-radius: 50px;
    color: #fff;
    font-size: 0.87rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    transition: all 0.22s ease;
  }
  .download-btn:hover {
    background: rgba(255,255,255,0.26);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }
`;

export default function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFile,  setOriginalFile]  = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [activeFilter,  setActiveFilter]  = useState('original');
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file, dataUrl) => {
    setOriginalImage(dataUrl);
    setOriginalFile(file);
    setFilteredImage(null);
    setActiveFilter('original');
    setStats(null);
  };

  const handleFilterApply = async (filterId) => {
    if (!originalFile) return;
    setLoading(true);
    setActiveFilter(filterId);
    try {
      const fd = new FormData();
      fd.append('file', originalFile);
      fd.append('filter_name', filterId);
      const res  = await fetch('http://localhost:8084/apply-filter', { method: 'POST', body: fd });
      const data = await res.json();
      setFilteredImage(`data:image/png;base64,${data.image}`);
      setStats({ time: data.processing_time_ms, width: data.width, height: data.height, filter: filterId });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg,rgba(4,8,20,0.74) 0%,rgba(8,18,38,0.68) 60%,rgba(4,12,28,0.76) 100%)',
          paddingBottom: '64px',
        }}>
          <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 24px' }}>

            <div className="anim-up" style={{ animationDelay: '0ms' }}>
              <Header />
            </div>

            {/* TOP ROW : uploader + filters side by side */}
            <div className="anim-up" style={{ animationDelay: '100ms', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>
              <ImageUploader onUpload={handleImageUpload} hasImage={!!originalImage} />
              <FilterSelector
                activeFilter={activeFilter}
                onSelect={handleFilterApply}
                disabled={loading || !originalImage}
              />
            </div>

            {/* PREVIEW */}
            <div className="anim-up" style={{ animationDelay: '180ms', marginBottom: '20px' }}>
              <ImagePreview
                original={originalImage}
                filtered={filteredImage}
                loading={loading}
                activeFilter={activeFilter}
              />
            </div>

            {/* STATS */}
            {stats && (
              <div className="anim-in" style={{ animationDelay: '0ms' }}>
                <StatsBar stats={stats} filtered={filteredImage} originalFile={originalFile} />
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}