import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || 'Mind Harmony <events@mail.mindharmony.life>';
  // No admin email for community signup per latest requirement

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY environment variable' });
  }

  const { name, email, interest } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const resend = new Resend(RESEND_API_KEY);

  const visitorHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charSet="utf-8" />
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 640px; margin: 0 auto; padding: 24px; }
      .header { background: #1E3A5F; color: #fff; padding: 16px; border-radius: 8px 8px 0 0; }
      .content { border: 1px solid #eee; border-top: 0; padding: 20px; }
      .footer { background: #f7f7f7; padding: 12px; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Welcome to Mind Harmony</h2>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>Thank you for joining our community! We’ll keep you posted about upcoming events, piano meditations, and ways to gather in harmony.</p>
        <p>With gratitude,<br/>Victor & the Mind Harmony Team</p>
      </div>
      <div class="footer">
        You’re receiving this because you signed up on mindharmony.life
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await resend.emails.send({ from: EMAIL_FROM, to: email, subject: 'Welcome to Mind Harmony', html: visitorHtml });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Community welcome email send error:', err);
    return res.status(500).json({ error: 'Failed to send email', details: err?.message });
  }
}


