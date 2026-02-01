"use server";

import { Resend } from "resend";
import WelcomeNewsletter from "@/emails/WelcomeNewsletter";
import WelcomeWaitlist from "@/emails/WelcomeWaitlist";

export async function subscribeAction(formData: FormData) {
  console.log("Starting subscribeAction...");
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return { success: false, error: "Configuration Error: Missing API Key" };
  }

  const resend = new Resend(apiKey);

  try {
    // Hardcoded Audience ID for Newsletter
    const audienceId = "d08e1b15-ea9f-4589-88f7-fe3cbd9fdda1";
    console.log(`subscribeAction: Using Hardcoded Audience ID: ${audienceId}`);

    console.log("subscribeAction: Creating contact...");
    const contactResult = await resend.contacts.create({
      email: email,
      firstName: "",
      lastName: "",
      unsubscribed: false,
      audienceId: audienceId,
    });
    console.log(
      "subscribeAction: Contact created successfully. Result:",
      JSON.stringify(contactResult),
    );

    try {
      console.log("subscribeAction: Sending email...");
      await resend.emails.send({
        from: "updates@sotercare.com",
        to: email,
        subject: "Welcome to Weekly Wellness",
        react: WelcomeNewsletter(),
      });
      console.log("subscribeAction: Email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe:", error);
    return { success: false, error: "Failed to subscribe" };
  }
}

export async function joinWaitlistAction(formData: FormData) {
  console.log("Starting joinWaitlistAction...");
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return { success: false, error: "Configuration Error: Missing API Key" };
  }

  const resend = new Resend(apiKey);

  try {
    // Hardcoded Audience ID for Waitlist
    const audienceId = "d1ea57f6-82b0-4ce4-9f86-5d54a8ab8d38";
    console.log(
      `joinWaitlistAction: Using Hardcoded Audience ID: ${audienceId}`,
    );

    console.log("joinWaitlistAction: Creating contact...");
    const contactResult = await resend.contacts.create({
      email: email,
      firstName: "",
      lastName: "",
      unsubscribed: false,
      audienceId: audienceId,
    });
    console.log(
      "joinWaitlistAction: Contact created successfully. Result:",
      JSON.stringify(contactResult),
    );

    try {
      console.log("joinWaitlistAction: Sending email...");
      await resend.emails.send({
        from: "updates@sotercare.com",
        to: email,
        subject: "You are on the list",
        react: WelcomeWaitlist(),
      });
      console.log("joinWaitlistAction: Email sent successfully.");
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to join waitlist:", error);
    return { success: false, error: "Failed to join waitlist" };
  }
}
