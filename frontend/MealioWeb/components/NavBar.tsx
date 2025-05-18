// File: components/NavBar.tsx
import React from 'react';

export default function NavBar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-around', padding: 16, background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <a href="#hero">Hero</a>
      <a href="#features">Features</a>
      <a href="#screenshots">Screenshots</a>
      <a href="#how-it-works">How It Works</a>
      <a href="#testimonials">Testimonials</a>
      <a href="#faq">FAQ</a>
      <a href="#contact">Contact</a>
    </nav>
  );
}
