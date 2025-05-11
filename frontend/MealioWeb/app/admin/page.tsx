
// app/admin/page.tsx
import React from 'react';

export default function AdminHomePage() {
  return (
    <div>
      <h1>Platform Overview</h1>
      <p>Total users: (fetch from API)</p>
      <p>Total orders today: (fetch from API)</p>
      {/* …other dashboard widgets… */}
    </div>
  );
}
