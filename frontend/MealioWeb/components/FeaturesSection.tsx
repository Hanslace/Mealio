import React from 'react';

const features = [
  { title: 'Feature 1', description: 'Short description.' },
  { title: 'Feature 2', description: 'Short description.' },
  { title: 'Feature 3', description: 'Short description.' },
  { title: 'Feature 4', description: 'Short description.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '60px 20px' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>Features & Benefits</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
        {features.map((feat, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 12px', background: '#eee', borderRadius: 8 }} />
            <h3 style={{ margin: '0 0 8px' }}>{feat.title}</h3>
            <p style={{ margin: 0 }}>{feat.description}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80%', height: 200, margin: '0 auto', background: '#ddd', borderRadius: 8 }} />
      </div>
    </section>
  );
}