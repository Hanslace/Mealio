// File: components/HeroSection.tsx
import React from 'react';

export default function HeroSection() {
    const downloadLink = process.env.NEXT_PUBLIC_DOWNLOAD_LINK;
  if (!downloadLink) {
    console.error('NEXT_PUBLIC_DOWNLOAD_LINK is not defined');
    return null;
  }
  return (
    <section id="hero" style={{ textAlign: 'center', padding: '80px 20px', background: '#f9f9f9' }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 16px' }}>Big Headline</h1>
      <p style={{ fontSize: '1.25rem', margin: '0 0 24px' }}>Short Pitch</p>
      <a href="{downloadLink}">
        <button style={{ fontSize: '1rem', padding: '12px 24px', borderRadius: 8, border: 'none', background: '#FFA500', color: '#fff', cursor: 'pointer' }}>
          Download
        </button>
      </a>
    </section>
  );
}