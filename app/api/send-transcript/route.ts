import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { visitorName, visitorEmail, messages, chatDate } = body;

        // Server-side validation
        if (
            !visitorName || typeof visitorName !== 'string' ||
            !visitorEmail || typeof visitorEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail) ||
            !messages || !Array.isArray(messages) || messages.length < 2
        ) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const safeName = escapeHtml(visitorName);
        const messagesHtml = messages.map((m: { timestamp?: string; role?: string; content?: string }) => `
      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #888;">${escapeHtml(new Date(m.timestamp || Date.now()).toLocaleTimeString())}</p>
        <p style="margin: 0; font-size: 14px;">
          <strong style="color: ${m.role === 'ada' ? '#F6821F' : '#333'};">${m.role === 'ada' ? 'Ada' : safeName}:</strong>
          ${escapeHtml(m.content)}
        </p>
      </div>
        `).join('');

        const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  
    <div style="background: #F6821F; padding: 24px; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 20px;">New Chat from Ada</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 4px 0 0; font-size: 14px;">anber.me portfolio assistant</p>
    </div>
  
    <div style="background: #f9f9f9; padding: 20px; border: 1px solid #eee;">
      <h2 style="font-size: 14px; color: #333; margin: 0 0 4px;">Visitor Details</h2>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Name:</strong> ${safeName}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${escapeHtml(visitorEmail)}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${escapeHtml(chatDate)}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Messages:</strong> ${messages.length}</p>
    </div>
  
    <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
      <h2 style="font-size: 14px; color: #333; margin: 0 0 16px;">Full Transcript</h2>
      ${messagesHtml}
    </div>
  
    <div style="padding: 16px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
      Sent automatically by Ada · anber.me
    </div>
  
  </div>
        `;

        const data = await resend.emails.send({
            from: 'Ada <ada@anber.me>', // Using fallback default to ensure it delivers without domain verification
            to: 'io@anber.me',
            subject: `New Chat Lead: ${visitorName} — ${chatDate}`,
            html,
        });

        if (data.error) {
            console.error('Resend error:', data.error);
            return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }
}
