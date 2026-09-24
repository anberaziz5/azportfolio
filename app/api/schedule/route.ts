import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

export async function POST(req: Request) {
  try {
    const { name, email, datetime } = await req.json();

    if (!name || !email || !datetime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Attempt to send email to both the site owner and the sender.
    // NOTE: Sending to the visitor's email requires a verified domain on Resend.
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Anber's Portfolio <onboarding@resend.dev>",
      to: ["io@anber.me", email],
      subject: `Meeting Scheduled with ${name}`,
      replyTo: email,
      html: `
        <h2>New Meeting Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Requested Date & Time:</strong> ${escapeHtml(new Date(datetime).toLocaleString())}</p>
        <hr/>
        <p><em>This is an automated confirmation sent to both the portfolio owner and the visitor. Anber will get back to you to confirm the meeting details.</em></p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
