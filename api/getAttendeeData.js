import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const supa = createClient(url, serviceKey);
  const { email, rid } = req.query;

  if (!email && !rid) {
    return res.status(400).json({ error: 'Email or RID required' });
  }

  try {
    let attendeeEmail = email;

    // If we have an RID, get the email from magic_link_dispatches
    if (rid && !email) {
      const { data: linkData } = await supa
        .from('magic_link_dispatches')
        .select('email')
        .eq('redirect_id', rid)
        .single();
      
      if (linkData?.email) {
        attendeeEmail = linkData.email;
      }
    }

    if (!attendeeEmail) {
      return res.status(400).json({ error: 'Could not determine email' });
    }

    const emailLower = String(attendeeEmail).toLowerCase().trim();

    // Try to find attendee data from multiple sources
    let attendeeData = {
      email: emailLower,
      firstName: '',
      lastName: '',
      city: '',
      state: '',
      phone: '',
      eventHistory: []
    };

    // 1. Check if they already have a user profile
    const { data: profileData } = await supa
      .from('user_profiles')
      .select('*')
      .eq('email', emailLower)
      .single();

    if (profileData) {
      attendeeData = {
        email: profileData.email,
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        city: profileData.city || '',
        state: profileData.state || '',
        phone: profileData.phone || '',
        eventHistory: []
      };
    } else {
      // 2. Check reservations table for their info
      const { data: reservationData } = await supa
        .from('reservations')
        .select('visitor_name, phone, created_at')
        .eq('visitor_email', emailLower)
        .order('created_at', { ascending: false })
        .limit(1);

      if (reservationData && reservationData.length > 0) {
        const nameParts = (reservationData[0].visitor_name || '').split(' ');
        attendeeData.firstName = nameParts[0] || '';
        attendeeData.lastName = nameParts.slice(1).join(' ') || '';
        attendeeData.phone = reservationData[0].phone || '';
      }

      // 3. Check community table for their info
      const { data: communityData } = await supa
        .from('community')
        .select('name, phone')
        .eq('email', emailLower)
        .single();

      if (communityData && !attendeeData.firstName) {
        const nameParts = (communityData.name || '').split(' ');
        attendeeData.firstName = nameParts[0] || '';
        attendeeData.lastName = nameParts.slice(1).join(' ') || '';
        attendeeData.phone = attendeeData.phone || communityData.phone || '';
      }
    }

    // 4. Get event attendance history (if available)
    const { data: eventHistory } = await supa
      .from('reservations')
      .select('created_at, seats')
      .eq('visitor_email', emailLower)
      .order('created_at', { ascending: false });

    attendeeData.eventHistory = eventHistory || [];

    return res.status(200).json({
      success: true,
      attendee: attendeeData,
      hasExistingProfile: !!profileData
    });

  } catch (error) {
    console.error('Get attendee data error:', error);
    return res.status(500).json({ 
      error: 'Failed to get attendee data', 
      details: error?.message 
    });
  }
}
