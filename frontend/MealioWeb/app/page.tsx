// app/page.tsx
import Image from 'next/image';
import Link  from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      {/* Hero section */}
      <section style={{ marginBottom: '2rem' }}>
        <Image
          src="/hero.png"
          alt="Delicious meals delivered"
          width={1200}   // replace with your image’s actual intrinsic width
          height={600}   // replace with your image’s actual intrinsic height
          priority       // preload for LCP
        />
      </section>

      {/* Features section */}
      <section style={{ marginBottom: '2rem' }}>
        <Image
          src="/features.png"
          alt="App features overview"
          width={800}
          height={400}
        />
      </section>

      {/* Example call-to-action */}
      <Link href="/download">
        <a style={{
          display: 'inline-block',
          padding: '1rem 2rem',
          backgroundColor: '#FFA500',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}>
          Download the App
        </a>
      </Link>
    </main>
  );
}