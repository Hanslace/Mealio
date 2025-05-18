import React from 'react';

const faqs = [
  { question: 'Is Mealio free?', answer: 'Yes, Mealio is completely free to use.' },
  { question: 'Which platforms are supported?', answer: 'iOS and Android.' },
];

export default function FAQSection() {
  return (
    <section id="faq" style={{ padding: '60px 20px', background: '#f9f9f9' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '40px' }}>FAQ</h2>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {faqs.map((faq, idx) => (
          <details key={idx} style={{ marginBottom: 16 }}>
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>{faq.question}</summary>
            <p style={{ margin: '8px 0 0' }}>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}