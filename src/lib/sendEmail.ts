import { Resend } from 'resend';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;
const EMAIL_FROM = import.meta.env.VITE_EMAIL_FROM || process.env.EMAIL_FROM || 'Mind Harmony <onboarding@resend.dev>';
const EMAIL_TO = import.meta.env.VITE_EMAIL_TO || process.env.EMAIL_TO || 'atrvictor@gmail.com';

const DONATION_LINK = 'https://venmo.com/u/mindharmony';

const resend = new Resend(RESEND_API_KEY);

export async function sendReservationEmails({
  visitorName,
  visitorEmail,
  eventName,
  eventDate,
  seats,
  donation,
  eventLocation,
  eventAddress,
  eventTime,
}: {
  visitorName: string;
  visitorEmail: string;
  eventName: string;
  eventDate: string;
  seats: number;
  donation?: number;
  eventLocation?: string;
  eventAddress?: string;
  eventTime?: string;
}) {
  const locationText = eventLocation ? ` at ${eventLocation}` : '';
  const addressText = eventAddress ? `\nLocation: ${eventAddress}` : '';
  const timeText = eventTime ? ` at ${eventTime}` : '';
  const donationText = donation ? `\nDonation: $${donation}` : '';

  // Email to the visitor (confirmation)
  const visitorEmailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #ddd; }
        .footer { background: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
        .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘 Reservation Confirmed - Mind Harmony</h1>
        </div>
        <div class="content">
            <p>Dear ${visitorName},</p>
            
            <p>Thank you for reserving your spot! We're excited to share this peaceful experience with you.</p>
            
            <h3>📅 Event Details:</h3>
            <ul>
                <li><strong>Event:</strong> ${eventName}</li>
                <li><strong>Date:</strong> ${eventDate}${timeText}</li>
                <li><strong>Seats Reserved:</strong> ${seats}</li>
                ${eventLocation ? `<li><strong>Location:</strong> ${eventLocation}</li>` : ''}
                ${eventAddress ? `<li><strong>Address:</strong> ${eventAddress}</li>` : ''}
                ${donation ? `<li><strong>Donation:</strong> $${donation}</li>` : ''}
            </ul>
            
            <p>We can't wait to see you there! Please arrive a few minutes early to settle in and prepare for a transformative experience.</p>
            
            ${donation ? `<p>Thank you for your generous donation. Your support helps us continue bringing these healing experiences to our community.</p>` : ''}
            
            <p>If you have any questions, please don't hesitate to reach out.</p>
            
            <p>With peace and gratitude,<br>
            <strong>The Mind Harmony Team</strong></p>
        </div>
        <div class="footer">
            Mind Harmony - Transforming lives through meditation and music<br>
            <em>This is an automated confirmation email</em>
        </div>
    </div>
</body>
</html>`;

  // Email to admin (notification)
  const adminEmailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #ddd; }
        .footer { background: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 New Event Reservation</h1>
        </div>
        <div class="content">
            <h3>New reservation received:</h3>
            <ul>
                <li><strong>Name:</strong> ${visitorName}</li>
                <li><strong>Email:</strong> ${visitorEmail}</li>
                <li><strong>Event:</strong> ${eventName}</li>
                <li><strong>Date:</strong> ${eventDate}${timeText}</li>
                <li><strong>Seats:</strong> ${seats}</li>
                ${eventLocation ? `<li><strong>Location:</strong> ${eventLocation}</li>` : ''}
                ${eventAddress ? `<li><strong>Address:</strong> ${eventAddress}</li>` : ''}
                ${donation ? `<li><strong>Donation:</strong> $${donation}</li>` : ''}
            </ul>
            
            <p><em>This reservation was submitted through your Mind Harmony website.</em></p>
        </div>
        <div class="footer">
            Mind Harmony Admin Notification
        </div>
    </div>
</body>
</html>`;

  try {
    // Send confirmation email to visitor
    await resend.emails.send({
      from: EMAIL_FROM,
      to: visitorEmail,
      subject: `Reservation Confirmed - ${eventName}`,
      html: visitorEmailContent,
    });

    // Send notification email to admin
    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `New Reservation: ${eventName} - ${visitorName}`,
      html: adminEmailContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw new Error('Failed to send emails');
  }
}