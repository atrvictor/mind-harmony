import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const rid = (req.query?.rid || req.query?.RID || '').toString();
    if (!rid) return res.status(400).send('Missing rid');

    const url = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return res.status(500).send('Server misconfigured');

    const supa = createClient(url, serviceKey);
    const { data, error } = await supa
      .from('magic_link_dispatches')
      .select('email, campaign, action_link')
      .eq('redirect_id', rid)
      .single();

    if (error || !data) return res.status(404).send('Link not found');

    const ua = req.headers['user-agent'] || '';
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString();

    await supa.from('link_clicks').insert({
      redirect_id: rid,
      email: data.email,
      campaign: data.campaign,
      user_agent: ua,
      ip
    });

    try {
      await supa.rpc('increment_magic_link_click', { rid_in: rid });
    } catch {}

    res.writeHead(302, { Location: data.action_link });
    return res.end();
  } catch (e) {
    return res.status(500).send('Server error');
  }
}


