"use server";

import { Resend } from "resend";

export async function subscribeAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  // Initialize Resend inside the action to ensure env vars are loaded and catch errors
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return { success: false, error: "Configuration Error: Missing API Key" };
  }

  const resend = new Resend(apiKey);

  try {
    const audienceId = process.env.RESEND_AUDIENCE_NEWS_ID;

    if (!audienceId || audienceId === "your_audience_id_here") {
      console.warn(
        "RESEND_AUDIENCE_NEWS_ID is not set or is a placeholder. Skipping contact creation.",
      );
      // Simulate network delay even if skipping, to keep UI consistent
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, warning: "Audience ID not configured" };
    }

    await resend.contacts.create({
      email: email,
      firstName: "", // We only collect email for now
      lastName: "",
      unsubscribed: false,
      audienceId: audienceId,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

export async function joinWaitlistAction(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  // Initialize Resend inside the action
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return { success: false, error: "Configuration Error: Missing API Key" };
  }

  const resend = new Resend(apiKey);

  try {
    const audienceId = process.env.RESEND_AUDIENCE_WAIT_ID;

    if (!audienceId || audienceId === "your_waitlist_id_here") {
      console.warn(
        "RESEND_AUDIENCE_WAIT_ID is not set or is a placeholder. Skipping contact creation.",
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, warning: "Waitlist Audience ID not configured" };
    }

    await resend.contacts.create({
      email: email,
      firstName: "",
      lastName: "",
      unsubscribed: false,
      audienceId: audienceId,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to join waitlist:", error);
    return { success: false, error: "Failed to join waitlist" };
  }
}
