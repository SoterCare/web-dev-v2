import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/lib/faqs";
import { pageMetadata, SITE_URL } from "@/lib/seo";

const TITLE = "SoterCare - Smart Care Monitoring for Care Homes";

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    description:
      "Camera-free monitoring for care homes in Sri Lanka. A thigh band on each resident alerts the right carer in seconds, spots trends and keeps records.",
    path: "/",
    socialTitle: TITLE,
    socialDescription:
      "Safer care for every resident without hiring more staff. Camera-free monitoring, instant carer alerts, trends and records for care homes.",
  }),
  // The page already names the brand, so skip the "| SoterCare" template.
  title: { absolute: TITLE },
};

// Schema that describes the home page only. Organization and WebSite are in the root layout.
// No Offer/price: SoterCare is quoted per care home, not sold at a public price.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      name: "SoterCare care home monitoring",
      serviceType: "Care home resident monitoring and alerting",
      description:
        "A body-worn thigh band, a 15.6-inch ward gateway and caregiver and guardian apps that monitor every resident, alert carers to critical events, learn each resident's patterns and keep the home's records, with no cameras.",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} id="home-jsonld" />
      <HomePage />
    </>
  );
}
