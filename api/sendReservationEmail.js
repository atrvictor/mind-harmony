import { Resend } from 'resend';

const DONATION_LINK = 'https://venmo.com/u/mindharmony';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Environment check:', {
    hasResendKey: !!process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    emailTo: process.env.EMAIL_TO
  });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const EMAIL_FROM = 'Mind Harmony <events@mail.mindharmony.life>';
  const EMAIL_TO = process.env.EMAIL_TO || 'atrvictor@gmail.com';
  const REPLY_TO = process.env.REPLY_TO;

  if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    return res.status(500).json({ error: 'Missing RESEND_API_KEY environment variable' });
  }

  console.log('Request body:', req.body);

  const resend = new Resend(RESEND_API_KEY);

  const { visitorName, visitorEmail, eventName, eventDate, seats, donation, eventLocation, eventAddress, eventTime } = req.body || {};
  if (!visitorName || !visitorEmail || !eventName || !eventDate || !seats) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Attempting to send visitor email...');
    // Email to visitor (keep existing plain-text copy)
    const visitorResult = await resend.emails.send({
      from: EMAIL_FROM,
      to: visitorEmail,
      subject: `✨ Your Spot is Reserved – ${eventName} ✨`,
      text: `⸻

Thank you for reserving your spot for ${eventName} on ${eventDate}!

✅ Seats reserved: ${seats}
📍 Location: ${eventLocation || 'TBD (details will be sent closer to the event)'}
⏰ Time: ${eventTime || 'TBD'}
📫 Address: ${eventAddress || 'TBD'}

Your donations help us bring more people together to experience the healing power of music and create these uplifting community gatherings.

The suggested donation is $20–$40 per person.

You can make a donation here: ${DONATION_LINK}

We are so grateful to have you join us for this transformative experience.

Warmly,
Victor & the MindHarmony Team`,
      ...(REPLY_TO ? { reply_to: REPLY_TO } : {}),
    });
    console.log('Visitor email result:', visitorResult);

    console.log('Attempting to send admin email...');
    // Email to admin (keep existing plain-text copy)
    const adminResult = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `New Reservation for ${eventName}`,
      text: `New reservation for ${eventName} on ${eventDate}.

Name: ${visitorName}
Email: ${visitorEmail}
Seats: ${seats}
Donation: $${donation || ''}`,
    });
    console.log('Admin email result:', adminResult);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ error: 'Failed to send email', details: error?.message });
  }
} 