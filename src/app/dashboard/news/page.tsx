import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAccessToken } from '@/lib/auth';
import { readNews } from '@/lib/news-store';
import NewsEditor from './NewsEditor';

export const metadata: Metadata = {
  title: 'News Editor',
  description: 'Manage SoterCare news articles',
};

export default async function NewsEditorPage() {
  if (process.env.NODE_ENV === 'production') notFound();

  const token = await getAccessToken();
  if (!token) redirect('/dashboard/login');

  const news = readNews();
  return <NewsEditor initialData={news} />;
}
