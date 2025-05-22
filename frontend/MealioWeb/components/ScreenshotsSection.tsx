'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Using placeholder images
const screenshots = [
  'https://picsum.photos/seed/1/260/480',
  'https://picsum.photos/seed/2/260/480',
  'https://picsum.photos/seed/3/260/480',
];

export default function ScreenshotsSection() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const update = () => setDarkMode(
      document.documentElement.classList.contains('dark')
    );
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const sectionStyle: React.CSSProperties = {
    padding: '100px 20px',
    background: darkMode ? '#37474F' : '#F5F5F5',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'visible',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '48px',
    color: darkMode ? '#FFF' : '#333',
  };

  const carouselStyle: React.CSSProperties = {
    display: 'flex',
    gap: 24,
    overflowX: 'auto',
    paddingBottom: 16,
    paddingTop: 16,
    scrollbarWidth: 'thin',
    scrollbarColor: darkMode ? '#FBBF24 #37474F' : '#F59E0B #E0E0E0',
  };

  const itemStyle: React.CSSProperties = {
    minWidth: 260,
    height: 480,
    background: darkMode ? '#2A2A2A' : '#fff',
    borderRadius: 20,
    boxShadow: darkMode
      ? '0 8px 24px rgba(0,0,0,0.4)'
      : '0 8px 24px rgba(0,0,0,0.1)',
    flexShrink: 0,
    position: 'relative',
    overflow: 'visible',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 20,
    transition: 'transform 0.4s ease',
    zIndex: 1,
  };

  return (
    <section id="screenshots" style={sectionStyle}>
      <h2 style={headingStyle}>Screenshots & Live Demo</h2>
      <div style={carouselStyle}>
        {screenshots.map((src, idx) => (
          <motion.div
            key={idx}
            style={itemStyle}
            whileHover={{
              scale: 1.1,
              zIndex: 10,
              boxShadow: darkMode
                ? '0 12px 32px rgba(0,0,0,0.6)'
                : '0 12px 32px rgba(0,0,0,0.2)',
            }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.img
              src={src}
              alt={`Screenshot ${idx + 1}`}
              style={imgStyle}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        #screenshots::-webkit-scrollbar {
          height: 8px;
        }
        #screenshots::-webkit-scrollbar-track {
          background: ${darkMode ? '#37474F' : '#E0E0E0'};
          border-radius: 4px;
        }
        #screenshots::-webkit-scrollbar-thumb {
          background-color: ${darkMode ? '#FBBF24' : '#F59E0B'};
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
