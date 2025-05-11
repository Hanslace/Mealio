// app/page.tsx
import React from 'react';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <h2>Welcome to Mealio</h2>
      <p>Delicious meals delivered to your door.</p>
      <div style={{ marginTop: 24 }}>
        <a
          href="https://apps.apple.com/…"
          style={{ marginRight: 16 }}
        >
          <img src="/appstore-badge.svg" alt="Download on the App Store" width={150} />
        </a>
        <a href="https://play.google.com/…">
          <img src="/googleplay-badge.png" alt="Get it on Google Play" width={150} />
        </a>
      </div>
    </div>
  );
}
