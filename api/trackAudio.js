import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return res.status(500).json({ error: 'Server misconfigured' });

  const supa = createClient(url, serviceKey);

  try {
    const { userEmail, userId, trackSrc, trackTitle, action, position, duration, rid, campaign } = req.body || {};
    if (!trackSrc || !action) return res.status(400).json({ error: 'Missing trackSrc or action' });

    // Optionally verify caller identity if Authorization header is provided
    // Not required for logging, but if present and invalid, we reject to avoid spoofing
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (token) {
      const { data: userData, error: userErr } = await supa.auth.getUser(token);
      if (userErr || !userData?.user) return res.status(401).json({ error: 'Invalid token' });
      // If a token is provided, prefer its identity
      const emailFromToken = userData.user.email || undefined;
      const idFromToken = userData.user.id || undefined;
      if (emailFromToken) req.body.userEmail = emailFromToken;
      if (idFromToken) req.body.userId = idFromToken;
    }

    const ua = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString();

    await supa.from('music_plays').insert({
      email: (req.body.userEmail || userEmail) || null,
      user_id: (req.body.userId || userId) || null,
      track_src: trackSrc,
      track_title: trackTitle || null,
      action,
      position_seconds: typeof position === 'number' ? position : null,
      duration_seconds: typeof duration === 'number' ? duration : null,
      rid: rid || null,
      campaign: campaign || null,
      user_agent: ua,
      ip
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to record', details: e?.message });
  }
}


