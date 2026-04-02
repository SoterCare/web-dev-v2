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
      from: "SoterCare <updates@sotercare.com>",
      to: email,
      subject: "Welcome to SoterCare Newsletter",
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
      from: "SoterCare <updates@sotercare.com>",
      to: email,
      subject: "You are on the SoterCare Waitlist",
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

export async function contactAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      throw new Error("All fields are required");
    }

    const resend = getResendClient();

    // 1. Send notification email to the SoterCare team
    const { default: ContactNotification } = await import("@/emails/ContactNotification");
    const { error: notifError } = await resend.emails.send({
      from: "SoterCare <info@sotercare.com>",
      to: "daham.20242053@iit.ac.lk",
      subject: `New Message from ${name} — SoterCare Contact`,
      react: ContactNotification({ senderName: name, senderEmail: email, message }),
    });

    if (notifError) {
      console.error("Contact Notification Email Failed:", notifError);
    }

    // 2. Send auto-reply to the user
    const { default: ContactAutoReply } = await import("@/emails/ContactAutoReply");
    const { error: replyError } = await resend.emails.send({
      from: "SoterCare <info@sotercare.com>",
      to: email,
      subject: "We got your message — SoterCare",
      react: ContactAutoReply({ senderName: name }),
    });

    if (replyError) {
      console.error("Contact Auto-Reply Email Failed:", replyError);
    }

    return { success: true };
  } catch (error) {
    console.error("contactAction Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}
