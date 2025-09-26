
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Caisse MG Pro - Nouveau Départ',
  description: 'Application réinitialisée.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
