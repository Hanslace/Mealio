'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { question: 'Is Mealio free to use?', answer: 'Yes! You only pay for the food and delivery — no app fees.' },
  { question: 'Which areas do you serve?', answer: 'We currently deliver in Karachi, Lahore, Islamabad, and more coming soon.' },
  { question: 'How do I pay?', answer: 'We support COD, cards, JazzCash, Easypaisa, and wallets.' },
  { question: 'Can I track my delivery?', answer: 'Absolutely. You’ll get live GPS tracking from the restaurant to your door.' },
];

export default function FAQSection() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const update = () => setDarkMode(
      document.documentElement.classList.contains('dark')
    );
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const sectionStyle: React.CSSProperties = {
    padding: '100px 20px',
    background: darkMode ? '#37474F' : '#F5F5F5',
    transition: 'background 0.3s',
    borderRadius: 20,
    margin: '20px 0px 00px 0px'
  };
  const headingStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '40px',
    color: darkMode ? '#FBBF24' : '#F59E0B',
    fontWeight: 700,
  };
  const containerStyle: React.CSSProperties = {
    maxWidth: 600,
    margin: '0 auto',
  };
  const itemStyle: React.CSSProperties = {
    background: darkMode ? '#2A2A2A' : '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: darkMode
      ? '0 4px 16px rgba(0,0,0,0.6)'
      : '0 4px 16px rgba(0,0,0,0.1)',
    transition: 'background 0.3s, box-shadow 0.3s',
  };
  const summaryStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    cursor: 'pointer',
    fontWeight: 600,
    color: darkMode ? '#EEE' : '#333',
  };
  const answerStyle: React.CSSProperties = {
    padding: '0 24px 16px',
    color: darkMode ? '#CCC' : '#555',
    lineHeight: 1.5,
  };

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" style={sectionStyle}>
      <h2 style={headingStyle}>FAQ</h2>
      <div style={containerStyle}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={itemStyle}>
            <div style={summaryStyle} onClick={() => toggle(idx)}>
              {faq.question}
              {openIndex === idx ? (
                <ChevronUp size={20} color={darkMode ? '#FBBF24' : '#F59E0B'} />
              ) : (
                <ChevronDown size={20} color={darkMode ? '#FBBF24' : '#F59E0B'} />
              )}
            </div>
            {openIndex === idx && <div style={answerStyle}>{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
