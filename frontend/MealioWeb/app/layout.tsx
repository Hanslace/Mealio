// app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Mealio',
  description: 'Your favorite meals, delivered fast.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <header style={{ padding: 16, background: '#FFA500', color: '#fff' }}>
          <h1>Mealio</h1>
        </header>
        <main style={{ padding: 24 }}>{children}</main>
        <footer style={{ padding: 16, textAlign: 'center', background: '#333', color: '#fff' }}>
          © {new Date().getFullYear()} Mealio
        </footer>
      </body>
    </html>
  );
}
