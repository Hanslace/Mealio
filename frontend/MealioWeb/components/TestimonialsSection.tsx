'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    text: 'Mealio has totally changed my daily routine. I don’t even cook anymore!',
    user: 'Sarah, Karachi',
    img: 'https://i.pravatar.cc/64?img=47',
  },
  {
    text: 'Blazing fast delivery, friendly riders, and hot food every time.',
    user: 'Asif, Lahore',
    img: 'https://i.pravatar.cc/64?img=12',
  },
  {
    text: 'I’ve saved so much with their daily coupons. A must-have app.',
    user: 'Maria, Islamabad',
    img: 'https://i.pravatar.cc/64?img=88',
  },
];

export default function TestimonialsSection() {
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
    background: darkMode ? '#37474F' : '#fff',
    transition: 'background 0.3s',
    textAlign: 'center',
    borderRadius: 20,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    marginBottom: '60px',
    color: darkMode ? '#FBBF24' : '#F59E0B',
    fontWeight: 700,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 32,
    maxWidth: 1200,
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: darkMode ? '#2A2A2A' : '#F9F9F9',
    borderRadius: 20,
    padding: 24,
    boxShadow: darkMode
      ? '0 8px 24px rgba(0,0,0,0.6)'
      : '0 8px 24px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    // center third testimonial
    gridColumn: 'span 1',
    
  };

  const avatarStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: '50%',
    marginBottom: 16,
    objectFit: 'cover',
    border: darkMode ? '2px solid #FBBF24' : '2px solid #F59E0B',
  };

  const quoteStyle: React.CSSProperties = {
    fontStyle: 'italic',
    color: darkMode ? '#EEE' : '#333',
    marginBottom: 16,
    lineHeight: 1.5,
  };

  const userStyle: React.CSSProperties = {
    fontWeight: 600,
    color: darkMode ? '#FBBF24' : '#F59E0B',
    marginTop: 'auto',
    fontSize: '1rem',
  };

  const starStyle: React.CSSProperties = {
    position: 'absolute',
    top: 16,
    right: 16,
    color: darkMode ? '#FBBF24' : '#FFD700',
    width: 24,
    height: 24,
  };

  return (
    <section id="testimonials" style={sectionStyle}>
      <h2 style={headingStyle}>Testimonials & Reviews</h2>
      <div style={gridStyle}>
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            style={{
              ...cardStyle,
              alignSelf: idx % 2 === 0 ? 'flex-start' : 'flex-end',
              ...(idx === 2 && { alignSelf: 'center' }),
            }}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 250 }}
          >
            <img src={t.img} alt={t.user} style={avatarStyle} />
            <Star style={starStyle} />
            <p style={quoteStyle}>&ldquo;{t.text}&rdquo;</p>
            <div style={userStyle}>— {t.user}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
