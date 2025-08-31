import { createClient } from '@supabase/supabase-js';

// Returns click and play stats for a list of emails
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return res.status(500).json({ error: 'Server misconfigured' });

  const supa = createClient(url, serviceKey);

  // Admin auth check
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Missing Authorization token' });
    const { data: userData, error: userErr } = await supa.auth.getUser(token);
    if (userErr || !userData?.user?.email) return res.status(401).json({ error: 'Invalid user token' });
    const adminEmails = ["atrvictor@gmail.com", "mashashen@yahoo.com"];
    const caller = String(userData.user.email).toLowerCase();
    if (!adminEmails.includes(caller)) return res.status(403).json({ error: 'Forbidden' });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { emails } = req.body || {};
  const list = Array.isArray(emails) ? emails : [];
  const norm = (e) => (String(e || '')).trim().toLowerCase();
  const lowerList = Array.from(new Set(list.map(norm).filter(Boolean)));

  try {
    const clickedMap = {};
    const playCountMap = {};
    if (lowerList.length > 0) {
      // Fetch all clicks and plays for these emails (case-insensitive)
      // We query wider and filter in memory for case-insensitive matching under RLS-safe service key
      const { data: clicks } = await supa
        .from('link_clicks')
        .select('email');
      (clicks || []).forEach((row) => {
        const e = norm(row.email);
        if (lowerList.includes(e)) clickedMap[e] = true;
      });

      const { data: plays } = await supa
        .from('music_plays')
        .select('email, action');
      (plays || []).forEach((row) => {
        const e = norm(row.email);
        if (!lowerList.includes(e)) return;
        if (row.action === 'play') playCountMap[e] = (playCountMap[e] || 0) + 1;
      });
    }

    return res.status(200).json({ clickedMap, playCountMap });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load stats', details: e?.message });
  }
}


