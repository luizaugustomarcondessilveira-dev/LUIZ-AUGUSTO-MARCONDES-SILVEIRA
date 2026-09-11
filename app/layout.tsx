import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rotinas da Família',
  description: 'Central de Auditoria & Dashboard dos Pais para supervisão de rotinas familiares, aprovação de tarefas e gestão de recompensas.',
  openGraph: {
    title: 'Rotinas da Família',
    description: 'Central de Auditoria & Dashboard dos Pais para supervisão de rotinas familiares, aprovação de tarefas e gestão de recompensas.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotinas da Família',
    description: 'Central de Auditoria & Dashboard dos Pais para supervisão de rotinas familiares, aprovação de tarefas e gestão de recompensas.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-amber-100 selection:text-amber-900 bg-surface text-on-surface font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
