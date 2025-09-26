
'use client';

import React from 'react';

/**
 * Ce composant est un point de départ minimaliste pour l'application.
 * Il est conçu pour garantir que le build Vercel réussisse sans l'erreur "root layout".
 * C'est notre nouvelle base stable.
 */
export default function MinimalPage() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f97316' }}>Nouveau Départ</h1>
      <p style={{ fontSize: '1.2rem', color: '#a0a0a0', marginTop: '1rem' }}>
        Votre application a été réinitialisée sur une base stable.
      </p>
      <p style={{ fontSize: '1rem', color: '#707070', marginTop: '0.5rem' }}>
        Nous pouvons maintenant reconstruire à partir d'ici.
      </p>
    </div>
  );
}
