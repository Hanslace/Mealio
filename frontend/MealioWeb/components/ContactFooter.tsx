'use client';

import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export default function ContactFooter() {
  const footerStyle: React.CSSProperties = {
    padding: '60px 20px',
    background: '#333',
    color: '#fff',
    textAlign: 'center',
  };
  const linkStyle: React.CSSProperties = {
    color: '#FFA500',
    textDecoration: 'none',
    margin: '0 8px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'transform 0.2s',
  };
  const iconStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    margin: '0 4px',
  };
  const socialContainer: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    margin: '16px 0',
  };
  const bottomText: React.CSSProperties = {
    margin: 0,
    fontSize: '0.9rem',
    color: '#ccc',
  };

  return (
    <footer id="contact" style={footerStyle}>
      <p style={{ margin: '0 0 12px', fontSize: '1rem' }}>
        Questions? Email us at{' '}
        <a href="mailto:support@mealio.com" style={linkStyle}>
          support@mealio.com
        </a>
      </p>
      <div style={socialContainer}>
        <a
          href="https://facebook.com/mealio"
          aria-label="Facebook"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Facebook style={iconStyle} />
        </a>
        <a
          href="https://twitter.com/mealio"
          aria-label="Twitter"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Twitter style={iconStyle} />
        </a>
        <a
          href="https://instagram.com/mealio"
          aria-label="Instagram"
          style={linkStyle}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Instagram style={iconStyle} />
        </a>
      </div>
      <p style={bottomText}>All rights reserved © {new Date().getFullYear()}</p>
    </footer>
  );
}
