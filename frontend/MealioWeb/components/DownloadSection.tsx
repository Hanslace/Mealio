'use client';

import React, { useState, useEffect } from 'react';

export default function DownloadSection() {
  // Hooks must be at the top level
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const update = () =>
      setDarkMode(document.documentElement.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const downloadLink = process.env.NEXT_PUBLIC_DOWNLOAD_LINK;
  if (!downloadLink) {
    console.error('NEXT_PUBLIC_DOWNLOAD_LINK is not defined');
    return null;
  }

  const sectionStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px 20px',
    background: darkMode
      ? 'linear-gradient(135deg, #263238 0%, #37474F 100%)'
      : 'linear-gradient(135deg, #FFECD2 0%, #FFB74D 100%)',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    color: darkMode ? '#FFF' : '#333',
    marginBottom: '32px',
    textShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.7)' : '0 2px 8px rgba(255,255,255,0.7)',
  };

  const buttonStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    padding: '16px 48px',
    borderRadius: 9999,
    border: 'none',
    background: darkMode ? '#FFB300' : '#FF8C00',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s, box-shadow 0.3s',
  };

  return (
    <section id="download" style={sectionStyle}>
      <h2 style={headingStyle}>Download the App</h2>
      <a href={downloadLink}>
        <button
          style={buttonStyle}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
          }}
        >
          Download Mealio
        </button>
      </a>

      {/* Decorative SVG circles */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: -40,
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 9999,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -50,
          right: -50,
          width: 150,
          height: 150,
          background: 'rgba(0,0,0,0.1)',
          borderRadius: 9999,
        }}
      />
    </section>
  );
}
