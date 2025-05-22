'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, MapPin, Smile } from 'lucide-react';

const steps = [
  { label: 'Browse', Icon: Search },
  { label: 'Order', Icon: ShoppingCart },
  { label: 'Track', Icon: MapPin },
  { label: 'Enjoy', Icon: Smile },
];

export default function HowItWorksSection() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const update = () =>
      setDarkMode(document.documentElement.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => obs.disconnect();
  }, []);

  const sectionStyle: React.CSSProperties = {
    padding: '100px 20px',
    background: darkMode ? '#2A2A2A' : '#F9F9F9',
    transition: 'background 0.3s',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '60px',
    color: darkMode ? '#FBBF24' : '#F59E0B',
    fontWeight: 700,
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    maxWidth: 1000,
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: darkMode ? '#333' : '#FFF',
    borderRadius: 20,
    padding: 24,
    boxShadow: darkMode
      ? '0 8px 24px rgba(0,0,0,0.6)'
      : '0 8px 24px rgba(0,0,0,0.1)',
    borderTop: `8px solid ${darkMode ? '#FBBF24' : '#F59E0B'}`,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const iconStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    marginBottom: 16,
    color: darkMode ? '#FBBF24' : '#F59E0B',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: darkMode ? '#EEE' : '#333',
  };

  const arrowStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    fill: 'none',
    stroke: darkMode ? '#FBBF24' : '#F59E0B',
    strokeWidth: 2,
    alignSelf: 'center',
  };

  return (
    <section id="how-it-works" style={sectionStyle}>
      <h2 style={headingStyle}>How It Works</h2>
      <div style={containerStyle}>
        {steps.flatMap((step, idx) => {
          const items: React.ReactNode[] = [];
          const { Icon } = step;
          items.push(
            <motion.div
              key={`card${idx}`}
              style={{
                ...cardStyle,
                alignSelf: idx % 2 === 0 ? 'flex-start' : 'flex-end',
              }}
              whileHover={{
                y: -10,
                boxShadow: darkMode
                  ? '0 12px 32px rgba(0,0,0,0.8)'
                  : '0 12px 32px rgba(0,0,0,0.2)',
                scale: 1.02,
              }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <Icon style={iconStyle} />
              <div style={labelStyle}>{step.label}</div>
            </motion.div>
          );
          if (idx < steps.length - 1) {
            items.push(
              <motion.svg
                key={`arrow${idx}`}
                viewBox="0 0 24 24"
                style={arrowStyle}
                animate={{ x: [0, 8, 0], y: [0, idx % 2 === 0 ? 8 : -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <path
                  d="M4 12h16M14 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            );
          }
          return items;
        })}
      </div>
    </section>
  );
}
