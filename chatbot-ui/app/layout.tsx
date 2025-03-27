import type { Metadata } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import ReactQueryProvider from '@/components/provider/react-query-provider';

const pretendard = localFont({
  // src: '../public/fonts/PretendardVariable.woff2',
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'Huniverse',
  description: 'Huniverse',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <body className={pretendard.className}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
