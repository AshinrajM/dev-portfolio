import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ashin Raj M. — Full-Stack Developer',
  description:
    'Ashin Raj M. builds scalable full-stack web applications and SEO-friendly websites with Python, Django, React, Next.js, and PostgreSQL.',
  keywords: [
    'Ashin Raj',
    'Full-Stack Developer',
    'Next.js',
    'Django',
    'React',
    'PostgreSQL',
    'SEO-friendly websites',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Ashin Raj M. — Full-Stack Developer',
    description:
      'Scalable full-stack web applications and SEO-friendly websites built with Python, Django, React, Next.js, and PostgreSQL.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashin Raj M. — Full-Stack Developer',
    description:
      'Scalable full-stack web applications and SEO-friendly websites built with Python, Django, React, Next.js, and PostgreSQL.',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
