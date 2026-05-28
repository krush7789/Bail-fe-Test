import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function escHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Bit AI Lab Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL ?? "hello@bitailab.com"],
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #0a0a0a; margin-bottom: 8px;">New Contact Form Submission</h2>
          <p style="color: #6b7280; margin-bottom: 24px; font-size: 14px;">Via bitailab.com</p>
          <hr style="border: none; border-top: 1px solid #e8e8e8; margin-bottom: 24px;" />
          <p style="margin-bottom: 8px;"><strong>Name:</strong> ${escHtml(name)}</p>
          <p style="margin-bottom: 8px;"><strong>Email:</strong> <a href="mailto:${escHtml(email)}" style="color: #ed821c;">${escHtml(email)}</a></p>
          <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 24px 0;" />
          <p style="margin-bottom: 8px;"><strong>Message:</strong></p>
          <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${escHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
