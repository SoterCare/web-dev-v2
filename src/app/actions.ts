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

  const audienceId = process.env.RESEND_AUDIENCE_NEWS_ID;
  if (!audienceId) {
    console.error("Missing RESEND_AUDIENCE_NEWS_ID");
    return {
      success: false,
      error: "Configuration Error: Missing Audience ID",
    };
  }

  const resend = new Resend(apiKey);
  console.log(
    `subscribeAction: Using API Key starting with: ${apiKey.substring(0, 8)}...`,
  );

  try {
    console.log(
      `subscribeAction: Using Audience ID starting with: ${audienceId.substring(0, 4)}...`,
    );

    console.log("subscribeAction: Creating contact...");
    const contactResult = await resend.contacts.create({
      email: email,
      firstName: "",
      lastName: "",
      unsubscribed: false,
      audienceId: audienceId,
    });

    // Check for errors in the contact creation response
    if (contactResult.error) {
      console.error(
        "subscribeAction: Failed to create contact:",
        contactResult.error,
      );
      throw new Error(
        `Failed to create contact: ${contactResult.error.message}`,
      );
    }

    console.log(
      "subscribeAction: Contact created successfully. FULL RESULT:",
      JSON.stringify(contactResult, null, 2),
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
      // We don't throw here strictly, as the subscription was successful
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

  const audienceId = process.env.RESEND_AUDIENCE_WAIT_ID;
  if (!audienceId) {
    console.error("Missing RESEND_AUDIENCE_WAIT_ID");
    return {
      success: false,
      error: "Configuration Error: Missing Audience ID",
    };
  }

  const resend = new Resend(apiKey);

  try {
    console.log(
      `joinWaitlistAction: Using Audience ID starting with: ${audienceId.substring(0, 4)}...`,
    );

    console.log("joinWaitlistAction: Creating contact...");
    const contactResult = await resend.contacts.create({
      email: email,
      firstName: "",
      lastName: "",
      unsubscribed: false,
      audienceId: audienceId,
    });

    // Check for errors in the contact creation response
    if (contactResult.error) {
      console.error(
        "joinWaitlistAction: Failed to create contact:",
        contactResult.error,
      );
      throw new Error(
        `Failed to create contact: ${contactResult.error.message}`,
      );
    }

    console.log(
      "joinWaitlistAction: Contact created successfully. FULL RESULT:",
      JSON.stringify(contactResult, null, 2),
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
