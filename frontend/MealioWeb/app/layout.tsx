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
        <header >
          
        </header>
        <main >{children}</main>
        <footer >
          
        </footer>
      </body>
    </html>
  );
}
