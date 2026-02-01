"use server";

import { Resend } from "resend";
import WelcomeNewsletter from "@/emails/WelcomeNewsletter";
import WelcomeWaitlist from "@/emails/WelcomeWaitlist";

// Initialize Resend with API Key check
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Configuration Error: Missing RESEND_API_KEY");
  }
  return new Resend(apiKey);
};

export async function subscribeAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    if (!email) throw new Error("Email is required");

    const audienceId = process.env.RESEND_AUDIENCE_NEWS_ID;
    if (!audienceId) throw new Error("Missing RESEND_AUDIENCE_NEWS_ID");

    const resend = getResendClient();

    // 1. Add to Audience (Newsletter)
    const { error: contactError } = await resend.contacts.create({
      email,
      audienceId,
    });

    if (contactError) {
      console.error("Newsletter Subscription Failed:", contactError);
      throw new Error(`Subscription failed: ${contactError.message}`);
    }

    // 2. Send Welcome Email
    const { error: emailError } = await resend.emails.send({
      from: "updates@sotercare.com",
      to: email,
      subject: "Welcome to Weekly Wellness",
      react: WelcomeNewsletter(),
    });

    if (emailError) {
      console.error("Newsletter Email Failed:", emailError);
      // We don't throw here to avoid failing the whole action if just the email fails
    }

    return { success: true };
  } catch (error) {
    console.error("subscribeAction Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to subscribe",
    };
  }
}

export async function joinWaitlistAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    if (!email) throw new Error("Email is required");

    const audienceId = process.env.RESEND_AUDIENCE_WAIT_ID;
    if (!audienceId) throw new Error("Missing RESEND_AUDIENCE_WAIT_ID");

    const resend = getResendClient();

    // 1. Add to Audience (Waitlist)
    const { error: contactError } = await resend.contacts.create({
      email,
      audienceId,
    });

    if (contactError) {
      console.error("Waitlist Join Failed:", contactError);
      throw new Error(`Join waitlist failed: ${contactError.message}`);
    }

    // 2. Send Confirmation Email
    const { error: emailError } = await resend.emails.send({
      from: "updates@sotercare.com",
      to: email,
      subject: "You are on the list",
      react: WelcomeWaitlist(),
    });

    if (emailError) {
      console.error("Waitlist Email Failed:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("joinWaitlistAction Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to join waitlist",
    };
  }
}
