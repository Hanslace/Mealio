'use client';

import React from 'react';
import Image from 'next/image';

// custom hook stays at top level
function useHtmlDarkMode() {
  const [dark, setDark] = React.useState(
    typeof window !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return dark;
}

export default function HeroSection() {
  const dark = useHtmlDarkMode();

  const downloadLink = process.env.NEXT_PUBLIC_DOWNLOAD_LINK;
  if (!downloadLink) {
    console.error('NEXT_PUBLIC_DOWNLOAD_LINK is not defined');
    return null;
  }

  // unified gradient
  const bgGradient = dark
    ? 'linear-gradient(135deg, #37474F 0%, #263238 100%)'
    : 'linear-gradient(135deg, #FFECD2 0%, #FFB74D 100%)';

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: bgGradient,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '0 20px',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          margin: 0,
          color: dark ? '#FFF' : '#333',
          textShadow: dark
            ? '0 2px 8px rgba(0,0,0,0.7)'
            : '0 2px 8px rgba(255,255,255,0.7)',
          zIndex: 2,
        }}
      >
        Delicious meals. Delivered fast.
      </h1>
      <p
        style={{
          fontSize: '1.25rem',
          color: dark ? '#EEE' : '#555',
          maxWidth: 600,
          lineHeight: 1.4,
          margin: '16px 0 32px',
          zIndex: 2,
        }}
      >
        Mealio connects hungry people with amazing restaurants. Tap, order,
        track. It’s that simple.
      </p>
      <a href={downloadLink}>
        <button
          style={{
            padding: '16px 48px',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: 9999,
            background: '#FF8C00',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s, box-shadow 0.3s',
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
          }}
        >
          Get the App
        </button>
      </a>

      {/* decorative hero image */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '40%',
          maxWidth: 400,
          opacity: 0.2,
          filter: dark ? 'brightness(0.6)' : 'none',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <Image
          src="/images/hero-pizza.png"
          alt="Hero pizza"
          width={400}
          height={300}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* bottom wave */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 1,
        }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={dark ? '#263238' : '#FFECD2'}
          d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,202.7C672,224,768,256,864,234.7C960,213,1056,139,1152,112C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </section>
  );
}
