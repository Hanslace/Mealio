'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function NavBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Toggle <html> dark class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#hero', label: 'Home' },
    { href: '#features', label: 'Features' },
    { href: '#screenshots', label: 'Screenshots' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  // Styles
  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: darkMode
      ? `rgba(17,17,17,${scrolled ? 0.95 : 0.8})`
      : `linear-gradient(135deg, #f59e0b ${scrolled ? '0%' : '0%'}, #fbbf24 50%, #f59e0b 100%)`,
    boxShadow: scrolled
      ? '0 4px 12px rgba(0,0,0,0.3)'
      : '0 8px 16px rgba(0,0,0,0.2)',
    transition: 'background 0.3s, box-shadow 0.3s, height 0.3s',
    zIndex: 1000,
    height: scrolled ? 80 : 100,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  };

  const container: React.CSSProperties = {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    padding: '0 24px',
  };

  const linkStyle: React.CSSProperties = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
    margin: '0 16px',
    padding: '10px 14px',
    borderRadius: 12,
    transition: 'background 0.3s, transform 0.2s',
  };

  const iconBtn: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 14,
    borderRadius: 12,
    color: '#fff',
    transition: 'background 0.3s, transform 0.2s',
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={navStyle}
    >
      <div style={container}>
        {/* Logo and Brand */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            textDecoration: 'none',
            fontSize: scrolled ? '1.7rem' : '1.9rem',
            fontWeight: 700,
            transition: 'font-size 0.3s',
          }}
        >
          <img
            src="/logo.png"
            alt="Mealio logo"
            style={{
              height: scrolled ? 36 : 40,
              width: scrolled ? 36 : 40,
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: 14,
              transition: 'height 0.3s, width 0.3s',
            }}
          />
          Mealio
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={linkStyle}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = 'scale(0.95)')
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          style={iconBtn}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = 'scale(0.9)')
          }
          onMouseUp={(e) =>
            (e.currentTarget.style.transform = 'scale(1)')
          }
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>
    </motion.nav>
  );
}
