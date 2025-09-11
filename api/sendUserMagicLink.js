import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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

  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const supa = createClient(url, serviceKey);
  const resend = new Resend(RESEND_API_KEY);

  try {
    const emailLower = email.toLowerCase().trim();

    // Check if user exists in user_profiles table (simpler and more reliable)
    const { data: profile, error: profileError } = await supa
      .from('user_profiles')
      .select('email, first_name')
      .eq('email', emailLower)
      .single();
    
    if (profileError || !profile) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    // Generate magic link that goes to welcome page (for existing users)
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

    // Use the first name from the profile we already fetched
    const firstName = profile.first_name || emailLower.split('@')[0];

    // Send simple login email - optimized for inbox delivery
    const subject = `${firstName}, your Mind Harmony sign-in link`;
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;max-width:600px">
        <p>Hi ${firstName},</p>
        <p>Here is your requested sign-in link for Mind Harmony:</p>
        <p><a href="${magicLink}" style="color:#1E3A5F;text-decoration:underline">Click here to sign in</a></p>
        <p>Or copy this link: ${magicLink}</p>
        <p style="font-size:12px;color:#666;margin-top:16px">This link expires in 1 hour for security.</p>
        <p>Best regards,<br/>Vitià<br/>Mind Harmony</p>
      </div>
    `;

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
      message: 'Sign-in link sent successfully' 
    });

  } catch (error) {
    console.error('User magic link error:', error);
    return res.status(500).json({ 
      error: 'Failed to send sign-in link', 
      details: error?.message 
    });
  }
}
