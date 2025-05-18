import React from 'react';

export default function ScreenshotsSection() {
  return (
    <section id="screenshots" style={{ padding: '60px 20px' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>Screenshots / Live Demo</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ width: 150, height: 300, background: '#ddd', borderRadius: 8 }} />
        ))}
      </div>
    </section>
  );
}