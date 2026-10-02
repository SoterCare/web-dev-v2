import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import PitchViewer from '@/components/PitchViewer';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SoterCare Pitch',
  robots: { index: false, follow: false },
};

// Serves the most recently modified PDF in public/pitch-deck, so a new deck is picked up by just dropping it in.
function findLatestDeck(): string | null {
  const dir = path.join(process.cwd(), 'public', 'pitch-deck');
  let files: string[];
  try {
    files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.pdf'));
  } catch {
    return null;
  }
  if (!files.length) return null;
  const latest = files
    .map((name) => ({ name, mtime: fs.statSync(path.join(dir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];
  return `/pitch-deck/${encodeURIComponent(latest.name)}?v=${Math.round(latest.mtime)}`;
}

export default function PitchPage() {
  return <PitchViewer src={findLatestDeck()} />;
}
