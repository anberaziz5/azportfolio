import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 100 || 
        typeof email !== "string" || email.length > 150 || 
        typeof message !== "string" || message.length > 5000) {
      return NextResponse.json(
        { error: "Payload exceeds size limits" },
        { status: 400 }
      );
    }

    // Attempt to send email to both the site owner and the sender.
    // NOTE: Sending to the visitor's email requires a verified domain on Resend.
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Anber's Portfolio <onboarding@resend.dev>",
      to: ["io@anber.me", email],
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      html: `
        <h2>New Message from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr/>
        <p><em>This is an automated copy sent to both the portfolio owner and the visitor.</em></p>
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
