'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Live Order Tracking',
    description: 'Track your delivery in real-time from kitchen to doorstep.',
    img: 'https://picsum.photos/seed/feature1/260/480',
  },
  {
    title: 'Instant Payments',
    description: 'Secure, one-tap payments via card, wallet, or COD.',
    img: 'https://picsum.photos/seed/feature2/260/480',
  },
  {
    title: 'Restaurant Ratings',
    description: 'Only the best local favorites, rated by real customers.',
    img: 'https://picsum.photos/seed/feature3/260/480',
  },
  {
    title: 'Promos & Discounts',
    description: 'New deals daily to keep your cravings affordable.',
    img: 'https://picsum.photos/seed/feature4/260/480',
  },
];


export default function FeaturesSection() {
  const [darkMode, setDarkMode] = useState(false);
  // detect dark mode via html class
  useEffect(() => {
    const update = () => setDarkMode(document.documentElement.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const sectionStyle: React.CSSProperties = {
    padding: '100px 20px',
    background: darkMode ? '#2A2A2A' : '#FFFBF5',
  };

  const headingStyle: React.CSSProperties = {
    color: darkMode ? '#FBBF24' : '#F59E0B',
    fontSize: '2.5rem',
    marginBottom: '48px',
    textAlign: 'center',
    fontWeight: 700,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 32,
    maxWidth: 1200,
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: darkMode ? '#333' : '#fff',
    borderRadius: 16,
    padding: 24,
    boxShadow: darkMode
      ? '0 8px 24px rgba(0,0,0,0.3)'
      : '0 8px 24px rgba(0,0,0,0.1)',
    textAlign: 'center',
    borderTop: `8px solid ${darkMode ? '#FBBF24' : '#F59E0B'}`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'background 0.3s, box-shadow 0.3s, transform 0.2s',
  };

  const imgStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    objectFit: 'fill',
    borderRadius: 16,
    marginBottom: 16,
    filter: darkMode ? 'brightness(0.8)' : 'none',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: 8,
    color: darkMode ? '#EEE' : '#333',
  };

  const descStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: darkMode ? '#CCC' : '#666',
  };

  return (
    <section id="features" style={sectionStyle}>
      <h2 style={headingStyle}>Features & Benefits</h2>
      <div style={gridStyle}>
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={cardStyle}
            onHoverStart={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1.05)';
            }}
            onHoverEnd={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1)';
            }}
          >
            <img src={feat.img} alt={feat.title} style={imgStyle} />
            <h3 style={titleStyle}>{feat.title}</h3>
            <p style={descStyle}>{feat.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
