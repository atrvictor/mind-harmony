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
  const EMAIL_FROM = process.env.EMAIL_FROM || 'Mind Harmony <events@mail.mindharmony.life>';

  if (!url || !serviceKey || !RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing required environment variables' });
  }

  const supa = createClient(url, serviceKey);
  const resend = new Resend(RESEND_API_KEY);

  const { campaign = 'concert_followup', emails, subject, html } = req.body || {};

  // Require an authenticated admin caller
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Missing Authorization token' });
    const { data: userData, error: userErr } = await supa.auth.getUser(token);
    if (userErr || !userData?.user?.email) {
      return res.status(401).json({ error: 'Invalid user token' });
    }
    const adminEmails = ["atrvictor@gmail.com", "mashashen@yahoo.com"]; // keep in sync with UI
    const callerEmail = String(userData.user.email).toLowerCase();
    if (!adminEmails.includes(callerEmail)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const normalize = (arr) => Array.from(new Set(
      (arr || [])
        .filter(e => typeof e === 'string')
        .map(e => (e || '').trim().toLowerCase())
        .filter(Boolean)
    ));

    // 1) Determine recipient list
    let emailsList = [];
    if (Array.isArray(emails) && emails.length > 0) {
      emailsList = normalize(emails);
    } else {
      const { data: community, error: commErr } = await supa
        .from('community')
        .select('email')
        .neq('email', null);
      if (commErr) throw commErr;
      emailsList = normalize((community || []).map(r => r.email));
    }

    if (emailsList.length === 0) {
      return res.status(200).json({ success: true, sent: 0, results: [] });
    }

    // 2) Grant music access up-front
    const accessRows = emailsList.map(email => ({ email, granted_by: 'system:' + campaign }));
    await supa
      .from('music_access')
      .upsert(accessRows, { onConflict: 'email', ignoreDuplicates: false });

    // 3) Send individualized magic links through short redirect for tracking
    const results = [];
    for (const email of emailsList) {
      // generate redirect id and set redirect target where magic link will send the user after auth
      const rid = crypto.randomBytes(10).toString('hex');
      const redirectTo = `https://mindharmony.life/?rid=${encodeURIComponent(rid)}&campaign=${encodeURIComponent(campaign)}`;

      let action_link;
      try {
        const { data: link1, error: e1 } = await supa.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: { redirectTo }
        });
        if (e1) throw e1;
        action_link = link1.properties?.action_link || link1.action_link;
      } catch {
        const { data: link2, error: e2 } = await supa.auth.admin.generateLink({
          type: 'signup',
          email,
          options: { redirectTo, shouldCreateUser: true }
        });
        if (e2) throw e2;
        action_link = link2.properties?.action_link || link2.action_link;
      }

      await supa.from('magic_link_dispatches').insert({
        redirect_id: rid,
        email,
        campaign,
        action_link
      });

      const trackUrl = `https://mindharmony.life/api/m?rid=${encodeURIComponent(rid)}`;

      // Build per-recipient email using provided subject/html or fallback
      const finalSubject = subject && typeof subject === 'string' && subject.trim().length > 0
        ? subject
        : 'Your Mind Harmony access';
      const baseHtml = html && typeof html === 'string' && html.trim().length > 0
        ? html
        : `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
            <p>Hi,</p>
            <p>Thank you for joining us yesterday. As a gift, your access to 4 piano meditation tracks is unlocked.</p>
            <p><a href="{{link}}" style="background:#1E3A5F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Sign in with Magic Link</a></p>
            <p style="font-size:12px;color:#555;margin-top:8px">or copy and paste into browser:<br>{{link}}</p>
            <p>With gratitude,<br/>Vitiá</p>
          </div>
        `;
      let finalHtml = baseHtml.replace(/\{\{\s*link\s*\}\}/g, trackUrl);
      // Append button+fallback only if the HTML doesn't already contain an anchor to this URL
      const hasAnchor = new RegExp(`<a[^>]+href=["']${trackUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(finalHtml);
      if (!hasAnchor) {
        const fallbackBlock = `
          <div style=\"font-family:Arial,sans-serif;line-height:1.6;color:#111;margin-top:12px\">
            <a href=\"${trackUrl}\" style=\"display:inline-block;background:#1E3A5F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none\">Sign in with Magic Link</a>
            <div style=\"font-size:12px;color:#555;margin-top:8px\">or copy and paste into browser: <span style=\"word-break:break-all\">${trackUrl}</span></div>
          </div>
        `;
        finalHtml = `${finalHtml}${fallbackBlock}`;
      }

      try {
        const resp = await resend.emails.send({ from: EMAIL_FROM, to: email, subject: finalSubject, html: finalHtml });
        results.push({ email, id: resp?.data?.id || null, error: null });
      } catch (e) {
        results.push({ email, id: null, error: e?.message || 'send-error' });
      }
    }

    const sent = results.filter(r => r.id).length;
    return res.status(200).json({ success: true, sent, results });
  } catch (err) {
    console.error('sendMagicLinksToCommunity error:', err);
    return res.status(500).json({ error: 'Failed to send', details: err?.message });
  }
}


