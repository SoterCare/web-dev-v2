'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  data: unknown;
  id?: string;
}

/**
 * Client-only JSON-LD injector component.
 * Avoids hydration mismatch by injecting structured data after mount.
 */
export default function JsonLd({ data, id = 'json-ld' }: JsonLdProps) {
  useEffect(() => {
    // Remove any existing script with this id (cleanup from previous renders)
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and inject the JSON-LD script
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  // Render nothing - script is injected into head
  return null;
}
