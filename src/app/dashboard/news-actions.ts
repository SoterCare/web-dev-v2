"use server";

import fs from 'fs';
import path from 'path';
import type { NewsData } from '@/types/news';
import { readNews, writeNews } from '@/lib/news-store';
import { safeImageFilename } from '@/lib/upload';

async function assertDev() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('News CMS actions are dev-only and not available in production.');
  }
}

export async function getNewsAction(): Promise<NewsData> {
  await assertDev();
  return readNews();
}

export async function saveNewsAction(data: NewsData): Promise<{ ok: true }> {
  await assertDev();
  writeNews(data);
  return { ok: true };
}

export async function uploadNewsImageAction(formData: FormData): Promise<{ path: string }> {
  await assertDev();

  const file = formData.get('file') as File | null;
  if (!file) throw new Error('No file provided');

  const dir = path.join(process.cwd(), 'public', 'images', 'news');
  fs.mkdirSync(dir, { recursive: true });

  const existing = fs.readdirSync(dir);
  const filename = safeImageFilename(file.name, existing);
  const dest = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  const sharp = (await import('sharp')).default;
  await sharp(buffer).webp({ quality: 85 }).toFile(dest);

  return { path: `/images/news/${filename}` };
}
