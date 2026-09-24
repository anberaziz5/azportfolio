import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, agenda, submittedAt } = body;

        // Validation
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }
        
        if (!agenda || typeof agenda !== 'string' || agenda.length > 1000) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

  <div style="background: #F6821F; padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">📅 New Meeting Request</h1>
    <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">via Ada on anber.me</p>
  </div>

  <div style="background: #f9f9f9; padding: 24px; border: 1px solid #eee; border-top: none;">
    <p style="margin: 0 0 12px; font-size: 15px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p style="margin: 0 0 12px; font-size: 15px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="margin: 0 0 12px; font-size: 15px;"><strong>Submitted:</strong> ${escapeHtml(submittedAt || new Date().toLocaleString())}</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;"/>
    <h2 style="font-size: 14px; color: #333; margin: 0 0 8px;">Meeting Agenda</h2>
    <p style="font-size: 15px; color: #444; background: white; padding: 16px; border-radius: 6px; border: 1px solid #ddd; margin: 0;">${escapeHtml(agenda)}</p>
  </div>

  <div style="padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
    Reply directly to this email to respond to ${escapeHtml(name)} · Sent by Ada · anber.me
  </div>

</div>
`;

        const data = await resend.emails.send({
            from: 'Ada <ada@anber.me>',
            to: 'io@anber.me',
            replyTo: email,
            subject: `📅 New Meeting Request: ${name} — ${submittedAt}`,
            html,
        });

        if (data.error) {
            console.error('Resend error:', data.error);
            return NextResponse.json({ error: 'Failed to send appointment' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json({ error: 'Failed to send appointment' }, { status: 500 });
    }
}
