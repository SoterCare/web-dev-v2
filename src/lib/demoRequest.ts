export interface DemoRequest {
  name: string;
  email: string;
  message: string;
  home: string;
  beds: string;
  role: string;
}

const text = (value: FormDataEntryValue | null, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseDemoRequest(formData: FormData): DemoRequest {
  const name = text(formData.get("name"), 100);
  const email = text(formData.get("email"), 254);
  const message = text(formData.get("message"), 4000);

  if (!name || !email || !message) {
    throw new Error("Name, email and message are required");
  }
  if (!EMAIL.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  return {
    name,
    email,
    message,
    home: text(formData.get("home"), 150),
    beds: text(formData.get("beds"), 40).replace(/\D/g, "").slice(0, 5),
    role: text(formData.get("role"), 100),
  };
}

export function buildSubject(req: DemoRequest): string {
  return req.home
    ? `New care-home enquiry from ${req.name} (${req.home}) — SoterCare`
    : `New message from ${req.name} — SoterCare`;
}
