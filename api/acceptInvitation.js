import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const supa = createClient(url, serviceKey);

  try {
    const {
      rid,
      email,
      firstName,
      lastName,
      phone,
      city,
      state,
      communicationPreference,
      discoveryMethod,
      interests,
      smsConsent,
      emailUpdates,
      termsAccepted
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!smsConsent || !termsAccepted) {
      return res.status(400).json({ error: 'Required consents not provided' });
    }

    const emailLower = email.toLowerCase().trim();
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';

    // 1. Create/update user profile
    const userData = {
      email: emailLower,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      city: city?.trim() || '',
      state: state?.trim() || '',
      communication_preference: communicationPreference || 'important',
      discovery_method: discoveryMethod || '',
      interests: interests || [],
      sms_consent: smsConsent,
      email_updates: emailUpdates,
      invitation_rid: rid,
      terms_accepted_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { error: profileError } = await supa
      .from('user_profiles')
      .upsert(userData, { onConflict: 'email' });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw new Error('Failed to create user profile');
    }

    // 2. Record SMS consent for compliance
    if (smsConsent) {
      await supa.from('sms_consents').insert({
        email: emailLower,
        phone: phone.trim(),
        ip_address: ipAddress,
        user_agent: userAgent,
        consent_method: 'invitation_signup'
      });
    }

    // 3. Grant music access
    const { error: accessError } = await supa
      .from('music_access')
      .upsert({ 
        email: emailLower,
        granted_by: 'invitation_acceptance'
      }, { onConflict: 'email' });

    if (accessError) {
      console.error('Music access error:', accessError);
      throw new Error('Failed to grant music access');
    }

    // 4. Add to community table (for backwards compatibility)
    await supa
      .from('community')
      .upsert([{ 
        email: emailLower, 
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        created_at: new Date().toISOString()
      }], { onConflict: 'email', ignoreDuplicates: true });

    // 5. Update magic link dispatch record
    if (rid) {
      await supa
        .from('magic_link_dispatches')
        .update({ 
          accepted_at: new Date().toISOString(),
          user_data: userData 
        })
        .eq('redirect_id', rid);
    }

    // 6. Create Supabase auth user account
    let authResult;
    try {
      // Try to create the user account
      authResult = await supa.auth.admin.createUser({
        email: emailLower,
        email_confirm: true, // Auto-confirm since they clicked the magic link
        user_metadata: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          invitation_accepted: true
        }
      });
    } catch (authError) {
      // User might already exist, that's okay
      console.log('Auth user creation note:', authError?.message);
    }

    // 7. Generate a new magic link for immediate login
    const loginRedirectTo = `https://mindharmony.life/welcome?welcome=true`;
    const { data: loginLink, error: loginError } = await supa.auth.admin.generateLink({
      type: 'magiclink',
      email: emailLower,
      options: { redirectTo: loginRedirectTo }
    });

    if (loginError) {
      console.error('Login link generation error:', loginError);
      throw new Error('Failed to generate login link');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Invitation accepted successfully',
      loginLink: loginLink.properties?.action_link || loginLink.action_link
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    return res.status(500).json({ 
      error: 'Failed to accept invitation', 
      details: error?.message 
    });
  }
}
