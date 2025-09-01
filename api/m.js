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

    try {
      // Auto-add to community if not present (use name from recent reservation if available)
      const emailLower = String(data.email || '').toLowerCase();
      const { data: existing } = await supa
        .from('community')
        .select('email')
        .eq('email', emailLower)
        .maybeSingle();
      if (!existing) {
        let name = null;
        try {
          const { data: resv } = await supa
            .from('reservations')
            .select('visitor_name, created_at')
            .eq('visitor_email', emailLower)
            .order('created_at', { ascending: false })
            .limit(1);
          if (resv && resv.length > 0) name = resv[0].visitor_name || null;
        } catch {}
        await supa
          .from('community')
          .upsert([{ email: emailLower, name }], { onConflict: 'email', ignoreDuplicates: true });
      }
    } catch {}

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

    // Check if this is an invitation campaign - redirect to landing page instead of direct auth
    if (data.campaign && data.campaign.includes('invitation')) {
      const invitationUrl = `https://mindharmony.life/invitation?rid=${encodeURIComponent(rid)}&email=${encodeURIComponent(data.email)}&campaign=${encodeURIComponent(data.campaign)}`;
      res.writeHead(302, { Location: invitationUrl });
      return res.end();
    }

    // For non-invitation campaigns, use original direct auth flow
    res.writeHead(302, { Location: data.action_link });
    return res.end();
  } catch (e) {
    return res.status(500).send('Server error');
  }
}


