import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DramaScale Global',
  description: '海外短剧爆款剧本生成工作台原型',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
