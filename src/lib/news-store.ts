import fs from 'fs';
import path from 'path';
import type { NewsData, NewsArticle } from '@/types/news';

const DATA_PATH = path.join(process.cwd(), 'data', 'news.json');
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateArticle(a: unknown, i: number): asserts a is NewsArticle {
  const art = a as Record<string, unknown>;
  for (const key of ['id', 'title', 'slug', 'summary', 'body', 'date', 'coverImage']) {
    if (typeof art[key] !== 'string') {
      throw new Error(`Article[${i}].${key} must be a string`);
    }
  }
  for (const key of ['id', 'title', 'slug', 'summary', 'body', 'date']) {
    if ((art[key] as string).trim() === '') {
      throw new Error(`Article[${i}].${key} must not be empty`);
    }
  }
  if (!DATE_RE.test(art.date as string)) {
    throw new Error(`Article[${i}].date must match YYYY-MM-DD, got "${art.date}"`);
  }
  if (!Array.isArray(art.tags) || art.tags.some((t) => typeof t !== 'string')) {
    throw new Error(`Article[${i}].tags must be an array of strings`);
  }
  if (art.pinned !== undefined && typeof art.pinned !== 'boolean') {
    throw new Error(`Article[${i}].pinned must be a boolean if present`);
  }
}

export function readNews(): NewsData {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw) as NewsData;
  if (!Array.isArray(data.articles)) throw new Error('news.json must have an articles array');
  data.articles.forEach((a, i) => validateArticle(a, i));
  return data;
}

export function writeNews(data: NewsData): void {
  if (!Array.isArray(data.articles)) throw new Error('articles must be an array');
  data.articles.forEach((a, i) => validateArticle(a, i));
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}
