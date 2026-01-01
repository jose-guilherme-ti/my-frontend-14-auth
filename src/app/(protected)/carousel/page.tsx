'use client';
import dynamic from 'next/dynamic';

// Desativa o SSR para o Loader, garantindo que o Federation não execute no Node.js
const MicroFrontend = dynamic(() => import('@/components/MicroFrontendLoader'), {
  ssr: false,
  loading: () => <p>Conectando ao servidor remoto...</p>
});

export default function RemotePage() {
  return (
    <>
      <h1>Host Next.js 14</h1>
      <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '10px' }}>
        <MicroFrontend />
      </div>
    </>
  );
}