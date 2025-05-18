import React from 'react';

export default function DownloadSection() {

  const downloadLink = process.env.NEXT_PUBLIC_DOWNLOAD_LINK;
  if (!downloadLink) {
    console.error('NEXT_PUBLIC_DOWNLOAD_LINK is not defined');
    return null;
  }
  return (
    <section id="download" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Download</h2>
      <a href="{downloadLink}">
        <button style={{ fontSize: '1rem', padding: '12px 24px', borderRadius: 8, border: 'none', background: '#FFA500', color: '#fff', cursor: 'pointer' }}>
          Download
        </button>
      </a>
    </section>
  );
}