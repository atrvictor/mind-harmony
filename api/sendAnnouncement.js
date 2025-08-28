import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = process.env.EMAIL_FROM || 'Mind Harmony <events@mail.mindharmony.life>';
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY environment variable' });
  }

  try {
    const { subject, to, html } = req.body || {};
    if (!subject || !to || !Array.isArray(to) || to.length === 0 || !html) {
      return res.status(400).json({ error: 'Missing subject, to[], or html' });
    }

    // Normalize and dedupe recipients server-side to prevent accidental duplicates
    const normalized = Array.from(new Set(
      to
        .filter(e => typeof e === 'string')
        .map(e => (e || '').trim().toLowerCase())
        .filter(e => e.includes('@'))
    ));

    const resend = new Resend(RESEND_API_KEY);
    const results = [];

    // Send individually for reliability (avoids potential batch + fallback double sends)
    for (const recipient of normalized) {
      try {
        const resp = await resend.emails.send({ from: EMAIL_FROM, to: recipient, subject, html });
        results.push({ to: recipient, id: resp?.data?.id || null, error: null });
      } catch (e) {
        results.push({ to: recipient, id: null, error: e?.message || 'send-error' });
      }
    }

    const sent = results.filter(r => r.id).length;
    return res.status(200).json({ success: true, sent, results });
  } catch (err) {
    console.error('sendAnnouncement error:', err);
    return res.status(500).json({ error: 'Failed to send announcement', details: err?.message });
  }
}


