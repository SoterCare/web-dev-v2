interface JsonLdProps {
  data: unknown;
  id?: string;
}

/**
 * Server-rendered JSON-LD, so crawlers that don't run JavaScript (Bing, AI crawlers) still see it.
 * "<" is escaped so text in the data can't close the script tag early.
 */
export default function JsonLd({ data, id = 'json-ld' }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
