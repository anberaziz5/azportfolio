import { NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

export async function POST(req: Request) {
  try {
    const { service, name, email, phone, requirements, availability } = await req.json();

    if (!service || !name || !email || !requirements) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 100 || 
        typeof email !== "string" || email.length > 150 || 
        typeof requirements !== "string" || requirements.length > 5000 ||
        (phone && (typeof phone !== "string" || phone.length > 50)) ||
        (availability && (typeof availability !== "string" || availability.length > 100))) {
      return NextResponse.json(
        { error: "Payload exceeds size limits" },
        { status: 400 }
      );
    }

    // Fire TWO emails using Promise.all
    // 1. Internal Notification
    // 2. Client Confirmation
    const [internalRes, clientRes] = await Promise.all([
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Anber <onboarding@resend.dev>",
        to: ["io@anber.me"],
        subject: `NEW ARCHITECTURE REQUEST: ${service}`,
        replyTo: email,
        html: `
          <div style="font-family: monospace; background: #000; color: #fff; padding: 20px;">
            <h2 style="color: #F38020;">[SYSTEM NOTIFICATION] New Architecture Request</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #333; color: #aaa;">Service</td>
                <td style="padding: 10px; border: 1px solid #333; font-weight: bold;">${escapeHtml(service)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #333; color: #aaa;">Name</td>
                <td style="padding: 10px; border: 1px solid #333;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #333; color: #aaa;">Email</td>
                <td style="padding: 10px; border: 1px solid #333;">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #333; color: #aaa;">Phone</td>
                <td style="padding: 10px; border: 1px solid #333;">${escapeHtml(phone || "N/A")}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #333; color: #aaa;">Availability</td>
                <td style="padding: 10px; border: 1px solid #333; color: #06d6a0;">${escapeHtml(availability || "N/A")}</td>
              </tr>
            </table>
            <h3 style="margin-top: 30px; color: #F38020;">Project Scope & Requirements:</h3>
            <p style="padding: 15px; border-left: 3px solid #F38020; background: #111;">
              ${escapeHtml(requirements).replace(/\n/g, '<br>')}
            </p>
          </div>
        `,
      }),
      resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Anber <onboarding@resend.dev>",
        to: [email],
        subject: `Request Received: ${service}`,
        html: `
          <div style="font-family: sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <h2 style="color: #000;">Request Transmitted</h2>
            <p>Hi ${escapeHtml(name)},</p>
            <p>This is an automated confirmation that we have successfully received your architecture request for <strong>${escapeHtml(service)}</strong>.</p>
            <p>Our team is currently reviewing your project requirements. An architect will contact you shortly to lock in your availability slot.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
            <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly to this email.</p>
          </div>
        `,
      })
    ]);

    if (internalRes.error) {
      console.error("Resend API Error (Internal):", internalRes.error);
      return NextResponse.json({ error: internalRes.error.message }, { status: 400 });
    }
    
    if (clientRes.error) {
      console.error("Resend API Error (Client):", clientRes.error);
      // We still return 200 because the internal notification might have succeeded
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
