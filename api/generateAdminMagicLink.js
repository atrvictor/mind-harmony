import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || 'Mind Harmony <events@mail.mindharmony.life>';

  if (!url || !serviceKey || !RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing required environment variables' });
  }

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Only allow admin emails
  const adminEmails = ['atrvictor@gmail.com', 'mashashen@yahoo.com'];
  if (!adminEmails.includes(email.toLowerCase().trim())) {
    return res.status(403).json({ error: 'Unauthorized - admin access only' });
  }

  const supa = createClient(url, serviceKey);
  const resend = new Resend(RESEND_API_KEY);

  try {
    const emailLower = email.toLowerCase().trim();

    // Generate magic link that goes directly to welcome page
    const redirectTo = `https://mindharmony.life/welcome`;
    
    const { data: linkData, error: linkError } = await supa.auth.admin.generateLink({
      type: 'magiclink',
      email: emailLower,
      options: { redirectTo }
    });

    if (linkError) {
      throw new Error(linkError.message);
    }

    const magicLink = linkData.properties?.action_link || linkData.action_link;

    // Send simple admin login email
    const subject = "Mind Harmony Admin Access";
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111">
        <p>Hi Victor,</p>
        <p>Here's your admin access link for Mind Harmony:</p>
        <p style="margin:16px 0">
          <a href="${magicLink}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:500">
            Access Admin Dashboard
          </a>
        </p>
        <p style="font-size:12px;color:#555">Or copy and paste: ${magicLink}</p>
        <p style="font-size:12px;color:#777">This link expires in 1 hour for security.</p>
      </div>
    `;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: emailLower,
      subject,
      html
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Admin magic link sent successfully' 
    });

  } catch (error) {
    console.error('Admin magic link error:', error);
    return res.status(500).json({ 
      error: 'Failed to send admin magic link', 
      details: error?.message 
    });
  }
}
