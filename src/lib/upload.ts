import path from 'path';

export function safeImageFilename(original: string, existing: string[]): string {
  const base =
    path
      .basename(original)
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'image';

  const candidate = `${base}.webp`;
  if (!existing.includes(candidate)) return candidate;

  let i = 1;
  while (existing.includes(`${base}-${i}.webp`)) i++;
  return `${base}-${i}.webp`;
}
