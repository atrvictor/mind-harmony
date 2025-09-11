import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || 'Vitià Kulish <vitia@mindharmony.life>';

  if (!url || !serviceKey || !RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing required environment variables' });
  }

  const { name, email, campaign = 'auto_community_join' } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supa = createClient(url, serviceKey);
  const resend = new Resend(RESEND_API_KEY);

  try {
    const emailLower = email.toLowerCase().trim();
    const firstName = name.split(' ')[0] || name;

    // 1. Grant music access
    await supa
      .from('music_access')
      .upsert({ 
        email: emailLower,
        granted_by: campaign
      }, { onConflict: 'email' });

    // 2. Generate magic link with 30-day expiration
    const rid = crypto.randomBytes(10).toString('hex');
    const redirectTo = `https://mindharmony.life/invitation?rid=${encodeURIComponent(rid)}&email=${encodeURIComponent(emailLower)}&campaign=${encodeURIComponent(campaign)}`;

    let action_link;
    try {
      const { data: link1, error: e1 } = await supa.auth.admin.generateLink({
        type: 'magiclink',
        email: emailLower,
        options: { redirectTo }
      });
      if (e1) throw e1;
      action_link = link1.properties?.action_link || link1.action_link;
    } catch {
      const { data: link2, error: e2 } = await supa.auth.admin.generateLink({
        type: 'signup',
        email: emailLower,
        options: { redirectTo, shouldCreateUser: true }
      });
      if (e2) throw e2;
      action_link = link2.properties?.action_link || link2.action_link;
    }

    // 3. Store magic link dispatch record
    await supa.from('magic_link_dispatches').insert({
      redirect_id: rid,
      email: emailLower,
      campaign: campaign,
      action_link
    });

    const trackUrl = `https://mindharmony.life/api/m?rid=${encodeURIComponent(rid)}`;

    // 4. Send campaign-specific email
    let subject, html;
    
    if (campaign === 'friend_invitation') {
      // Friend-specific email - optimized for inbox delivery
      subject = `Mind Harmony Verification & Welcome`;
      html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px">
        <p>Hey ${firstName},</p>
        <p>Thanks for joining Mind Harmony, the home of piano meditations and transformational experiences.</p>
        <p>You will now have early access to unreleased tracks that no one else has access to.</p>
        <p>Click here to verify your account and to get your personal access: <a href="${trackUrl}" style="color:#1E3A5F;text-decoration:underline">Access Your Songs</a></p>
        <p>What you'll get instantly:</p>
        <p style="margin-left:20px">• 4 exclusive unreleased piano tracks<br/>
        • Personal member access to Mind Harmony<br/>
        • First to know about intimate concerts</p>
        <p>Takes just 20 seconds to set up.</p>
        <p>I'd love to know what you think of the music!</p>
        <p>With gratitude,<br/>Vitià</p>
        <p style="font-size:11px;color:#666;margin-top:20px">Link: ${trackUrl}</p>
      </div>`;
    } else {
      // Default community join email
      subject = "Your Mind Harmony gift — access inside";
      html = `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#111">
        <p>Dear ${firstName},</p>
        <p>Thank you for being part of the Mind Harmony community and for sharing in our recent concerts. Your presence helps turn music into a true experience of peace, reflection, and connection.</p>
        <p>As a special thank‑you, here is a gift for you — access to 4 unreleased songs from Vitià's upcoming album, plus an invitation to become a Mind Harmony member with exclusive benefits.</p>
        <p><strong>Your gift includes:</strong></p>
        <ul style="margin:8px 0;padding-left:20px">
          <li>4 unreleased piano meditation tracks</li>
          <li>Mind Harmony membership with early access to events</li>
          <li>Exclusive community updates and offers</li>
        </ul>
        <p style="margin:16px 0"><a href="${trackUrl}" style="display:inline-block;background:#1E3A5F;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:500">Claim Your Gift & Join</a></p>
        <p style="font-size:12px;color:#555">or copy and paste into browser:<br/>${trackUrl}</p>
        <p style="font-size:12px;color:#777;margin-top:16px">This invitation expires in 30 days. We respect your privacy and will never share your information.</p>
        <p>With gratitude,<br/>Vitià Kulish<br/>Mind Harmony</p>
      </div>`;
    }

    // Send email
    await resend.emails.send({
      from: EMAIL_FROM,
      to: emailLower,
      subject,
      html,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Magic link sent successfully',
      magicLink: trackUrl,
      emailSent: true
    });

  } catch (error) {
    console.error('Auto magic link error:', error);
    return res.status(500).json({ 
      error: 'Failed to send magic link', 
      details: error?.message 
    });
  }
}
