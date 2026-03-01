'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const nav = document.querySelector('[data-site-navbar]') as HTMLElement | null;
  const offset = nav ? nav.getBoundingClientRect().bottom + 16 : 0;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
  return true;
}

const HashScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    const attemptScroll = (retries = 10) => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.replace('#', ''));
      if (!scrollToTarget(id) && retries > 0) {
        setTimeout(() => attemptScroll(retries - 1), 80);
      }
    };

    // Small delay to let the page render after navigation
    setTimeout(() => attemptScroll(10), 50);

    const handleHashChange = () => {
      attemptScroll(10);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  return null;
};

export default HashScroll;
