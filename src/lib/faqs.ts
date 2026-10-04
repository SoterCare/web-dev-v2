export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "How is SoterCare different from call bells and CCTV?",
    answer:
      "Call bells need a resident who can press them, and CCTV needs someone watching 24/7. SoterCare is worn on the body, spots a stand-up attempt before a fall, and alerts the right carer's phone in seconds, day and night. Nobody has to press anything or watch a screen.",
  },
  {
    question: "Does SoterCare use cameras?",
    answer:
      "No, never. SoterCare uses a body-worn band with motion, moisture and skin temperature sensors, so there are no cameras in bedrooms or bathrooms. That protects residents' privacy and dignity.",
  },
  {
    question: "Does it work if the internet goes down?",
    answer:
      "Detection and carer alerts run on the ward gateway inside the home, over the home's local network, so they keep working without internet. Features that need the cloud, such as long-term trends and the family app, catch up when the connection returns.",
  },
  {
    question: "What does it cost a care home?",
    answer:
      "Pricing is per home: a band for each resident, one ward gateway and a small monthly fee per bed. We are a startup building SoterCare with our first care homes, so we quote each home personally. Book a demo and tell us about your home.",
  },
  {
    question: "What can families see, and who gets alerts?",
    answer:
      "There are two logins. Carers receive the critical alerts. Families, as guardians, see real-time status, daily summaries, trends and patterns, and the full records. They are notified only when something concerning happens or an update is necessary for them.",
  },
  {
    question: "Is SoterCare a medical device?",
    answer:
      "SoterCare is a safety monitoring and record-keeping system. It does not diagnose. It helps carers respond faster and gives homes and families an accurate record.",
  },
  {
    question: "When can my family get SoterCare at home?",
    answer:
      "Care homes come first. Once SoterCare is proven there, we plan to bring it to families as a home kit. That is our promise to the community. Join the home-kit waitlist and we will keep you posted.",
  },
];
