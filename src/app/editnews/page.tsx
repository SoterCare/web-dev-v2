import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { readNews } from '@/lib/news-store';
import NewsEditor from './NewsEditor';

export const metadata: Metadata = {
  title: 'News Editor',
  robots: { index: false, follow: false },
};

export default function EditNewsPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  const news = readNews();
  return <NewsEditor initialData={news} />;
}
