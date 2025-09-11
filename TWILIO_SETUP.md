# Twilio SMS Setup Guide for Mind Harmony

## 1. Twilio Account Setup

### Get Your Credentials
1. Go to your [Twilio Console](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Get a phone number:
   - Go to Phone Numbers → Manage → Buy a number
   - Choose a number that supports SMS
   - Note down your Twilio phone number

## 2. Environment Variables

Add these to your `supa.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here  
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number with +1
```

## 3. Database Setup

Run this SQL in your Supabase dashboard to create the SMS tracking table:

```sql
-- Create SMS tracking table
CREATE TABLE IF NOT EXISTS sms_dispatches (
    id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL,
    campaign TEXT DEFAULT 'general',
    message_sid TEXT, -- Twilio message SID for tracking
    status TEXT DEFAULT 'sent',
    message_preview TEXT, -- First 100 chars of message for reference
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sms_dispatches_phone ON sms_dispatches(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_dispatches_campaign ON sms_dispatches(campaign);
CREATE INDEX IF NOT EXISTS idx_sms_dispatches_sent_at ON sms_dispatches(sent_at);
CREATE INDEX IF NOT EXISTS idx_sms_dispatches_message_sid ON sms_dispatches(message_sid);

-- Add RLS policy (assuming you have RLS enabled)
ALTER TABLE sms_dispatches ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to manage SMS dispatches
CREATE POLICY "Enable all operations for service role" ON sms_dispatches
    FOR ALL USING (auth.role() = 'service_role');

-- Policy to allow authenticated users to view SMS dispatches
CREATE POLICY "Users can view SMS dispatches" ON sms_dispatches
    FOR SELECT USING (true);
```

## 4. Available Endpoints

### Basic SMS: `/api/sendSMS`
```javascript
fetch('/api/sendSMS', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Hello from Mind Harmony!',
    campaign: 'general'
  })
})
```

### Magic Link SMS: `/api/sendMagicLinkSMS`
```javascript
fetch('/api/sendMagicLinkSMS', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '+1234567890',
    firstName: 'John',
    campaign: 'sms_magic_link'
  })
})
```

## 5. Admin Interface

The SMS sender is now available in your `/admin` page with:
- **Magic Link SMS**: Sends 4-song access (like ML2 email)
- **Event Reminders**: Template for upcoming events
- **Custom Messages**: Free-form messaging
- **Phone Formatting**: Accepts various formats
- **Character Counter**: Stay within SMS limits

## 6. Message Templates

### Magic Link SMS Template:
```
Hi {name}! 🎹

Mind Harmony here - I have 4 unreleased piano meditation tracks I'd love to share with you personally.

Tap here to access: [MAGIC_LINK]

Takes 20 seconds to set up and you'll get:
• 4 exclusive piano tracks
• Early access to events  
• Personal member access

Hope you enjoy them!
- Vitià
```

### Event Reminder Template:
```
Hi {name}! 🧘‍♀️

Reminder: Our piano meditation experience is tomorrow at Kate Sessions Park, 6:00 PM.

Looking forward to seeing you there!
- Mind Harmony
```

## 7. Best Practices

- **Timing**: Send between 10am-8pm recipient's local time
- **Consent**: Only text people who opted in
- **Length**: Keep under 1600 characters (SMS limit)
- **Personalization**: Use {name} placeholder for personal touch
- **Tracking**: All SMS sends are logged in `sms_dispatches` table
- **Testing**: Test with your own number first

## 8. Compliance Notes

- Follow [Twilio's Messaging Policy](https://www.twilio.com/docs/messaging/policies)
- Get explicit consent before sending marketing messages
- Include opt-out instructions for marketing messages
- Be mindful of frequency to avoid spam complaints

## 9. Costs

- SMS pricing varies by country (~$0.0075 per SMS in US)
- Check current pricing in your Twilio Console
- Monitor usage to stay within budget

## 10. Next Steps

1. Add environment variables
2. Run the database SQL
3. Deploy the changes
4. Test with your phone number
5. Start sending SMS to your community!

The SMS system is now integrated with your existing Mind Harmony flow and will work alongside your email system.
