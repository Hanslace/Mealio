// File: components/HowItWorksSection.tsx
import React from 'react';

const steps = ['Browse', 'Order', 'Track', 'Enjoy'];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ padding: '60px 20px', background: '#f9f9f9' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>How It Works</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              padding: '12px 24px',
              border: '2px solid #000',
              clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)',
              fontWeight: 'bold',
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}
