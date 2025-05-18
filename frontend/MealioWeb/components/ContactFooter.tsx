import React from 'react';

export default function ContactFooter() {
  return (
    <footer id="contact" style={{ padding: '40px 20px', textAlign: 'center', background: '#333', color: '#fff' }}>
      <p style={{ margin: '0 0 8px' }}>
        Contact us: <a href="mailto:support@mealio.com" style={{ color: '#FFA500', textDecoration: 'none' }}>support@mealio.com</a>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
        {/* Replace with actual social icons */}
        <a href="https://facebook.com/mealio" aria-label="Facebook">FB</a>
        <a href="https://twitter.com/mealio" aria-label="Twitter">TW</a>
        <a href="https://instagram.com/mealio" aria-label="Instagram">IG</a>
      </div>
      <p style={{ margin: 0 }}>All rights reserved {new Date().getFullYear()}</p>
    </footer>
  );
}