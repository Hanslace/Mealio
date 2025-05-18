// File: components/TestimonialsSection.tsx
import React from 'react';

const testimonials = [
  '“Mealio has changed how I eat.”',
  '“Fast, reliable, and delicious.”',
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: '60px 20px' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>Testimonials / Reviews</h2>
      {testimonials.map((text, idx) => (
        <p key={idx} style={{ fontStyle: 'italic', textAlign: 'center', maxWidth: 600, margin: '0 auto 24px' }}>
          {text}
        </p>
      ))}
    </section>
  );
}