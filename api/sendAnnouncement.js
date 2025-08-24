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

    const resend = new Resend(RESEND_API_KEY);

    // If single recipient, prefer direct send for reliable ID
    if (to.length === 1) {
      try {
        const resp = await resend.emails.send({ from: EMAIL_FROM, to: to[0], subject, html });
        const id = resp?.data?.id || null;
        return res.status(200).json({ success: true, sent: id ? 1 : 0, results: [{ to: to[0], id }] });
      } catch (e) {
        return res.status(200).json({ success: false, sent: 0, results: [{ to: to[0], id: null, error: e?.message || 'send-error' }] });
      }
    }

    // Preferred path: batch sending (up to 100 per request)
    const chunk = (arr, size) => arr.reduce((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);
    const emailChunks = chunk(to.filter(e => typeof e === 'string' && e.includes('@')), 100);
    const results = [];

    for (const group of emailChunks) {
      const batchPayload = group.map((recipient) => ({
        from: EMAIL_FROM,
        to: [recipient],
        subject,
        html,
      }));

      try {
        const resp = await resend.batch.send(batchPayload);
        const data = resp?.data || [];
        // For any missing id, fall back to a direct send to capture id
        for (let i = 0; i < group.length; i++) {
          const recipient = group[i];
          const id = data[i]?.id || null;
          if (id) {
            results.push({ to: recipient, id, error: null });
          } else {
            try {
              const single = await resend.emails.send({ from: EMAIL_FROM, to: recipient, subject, html });
              results.push({ to: recipient, id: single?.data?.id || null, error: null });
            } catch (e) {
              results.push({ to: recipient, id: null, error: e?.message || 'fallback-send-error' });
            }
          }
        }
      } catch (e) {
        // If batch fails, mark errors for the entire group
        group.forEach((recipient) => results.push({ to: recipient, id: null, error: e?.message || 'batch-error' }));
      }
    }

    const sent = results.filter(r => r.id).length;
    return res.status(200).json({ success: true, sent, results });
  } catch (err) {
    console.error('sendAnnouncement error:', err);
    return res.status(500).json({ error: 'Failed to send announcement', details: err?.message });
  }
}


