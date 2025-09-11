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

-- Policy to allow authenticated users to view their own SMS dispatches (if needed)
CREATE POLICY "Users can view SMS dispatches" ON sms_dispatches
    FOR SELECT USING (true); -- Adjust this based on your security needs
