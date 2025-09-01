-- Enhanced invitation and user profile system for Mind Harmony
-- This migration adds support for the new invitation landing page flow

-- 1. Enhanced user profiles table to store detailed member information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  city text,
  state text,
  communication_preference text CHECK (communication_preference IN ('everything', 'important', 'minimal')) DEFAULT 'important',
  discovery_method text,
  interests text[], -- Array of interests
  sms_consent boolean DEFAULT false,
  email_updates boolean DEFAULT true,
  invitation_rid text, -- Links back to magic_link_dispatches
  invitation_campaign text,
  terms_accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_profiles'
      AND policyname = 'user can manage own profile'
  ) THEN
    CREATE POLICY "user can manage own profile"
    ON public.user_profiles
    FOR ALL
    USING (email = auth.jwt()->>'email');
  END IF;
END $$;

-- Admins can read all profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_profiles'
      AND policyname = 'admin can read all profiles'
  ) THEN
    CREATE POLICY "admin can read all profiles"
    ON public.user_profiles
    FOR SELECT
    USING (
      auth.jwt()->>'email' IN ('atrvictor@gmail.com', 'masha.mindharmony@gmail.com')
    );
  END IF;
END $$;

-- 2. SMS consent tracking table for compliance
CREATE TABLE IF NOT EXISTS public.sms_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  phone text NOT NULL,
  consented_at timestamptz DEFAULT now(),
  withdrawn_at timestamptz,
  ip_address inet,
  user_agent text,
  consent_method text DEFAULT 'invitation_signup'
);

-- Enable RLS on sms_consents
ALTER TABLE public.sms_consents ENABLE ROW LEVEL SECURITY;

-- Users can read their own consent records
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'sms_consents'
      AND policyname = 'user can read own consents'
  ) THEN
    CREATE POLICY "user can read own consents"
    ON public.sms_consents
    FOR SELECT
    USING (email = auth.jwt()->>'email');
  END IF;
END $$;

-- Admins can read all consent records
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'sms_consents'
      AND policyname = 'admin can read all consents'
  ) THEN
    CREATE POLICY "admin can read all consents"
    ON public.sms_consents
    FOR SELECT
    USING (
      auth.jwt()->>'email' IN ('atrvictor@gmail.com', 'masha.mindharmony@gmail.com')
    );
  END IF;
END $$;

-- 3. Enhance existing magic_link_dispatches table
ALTER TABLE public.magic_link_dispatches 
ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS user_data jsonb,
ADD COLUMN IF NOT EXISTS invitation_type text DEFAULT 'general';

-- 4. Create invitation tracking table
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  invitation_type text NOT NULL DEFAULT 'past_attendee_gift',
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  magic_link_rid text, -- Links to magic_link_dispatches
  sent_at timestamptz DEFAULT now(),
  created_by text,
  metadata jsonb -- Store any additional invitation context
);

-- Enable RLS on invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Admins can manage invitations
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'invitations'
      AND policyname = 'admin can manage invitations'
  ) THEN
    CREATE POLICY "admin can manage invitations"
    ON public.invitations
    FOR ALL
    USING (
      auth.jwt()->>'email' IN ('atrvictor@gmail.com', 'masha.mindharmony@gmail.com')
    );
  END IF;
END $$;

-- 5. Create updated_at trigger for user_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON public.user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_sms_consents_email ON public.sms_consents(email);
CREATE INDEX IF NOT EXISTS idx_sms_consents_phone ON public.sms_consents(phone);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);

-- 7. Create view for admin dashboard to see invitation status
CREATE OR REPLACE VIEW public.invitation_summary AS
SELECT 
  i.id,
  i.email,
  i.invitation_type,
  i.sent_at,
  i.accepted_at,
  i.expires_at,
  CASE 
    WHEN i.accepted_at IS NOT NULL THEN 'accepted'
    WHEN i.expires_at < now() THEN 'expired'
    ELSE 'pending'
  END as status,
  up.first_name,
  up.last_name,
  up.phone,
  up.communication_preference,
  up.interests
FROM public.invitations i
LEFT JOIN public.user_profiles up ON i.email = up.email;

-- Grant access to the view for admins
GRANT SELECT ON public.invitation_summary TO authenticated;

COMMENT ON TABLE public.user_profiles IS 'Enhanced user profiles with communication preferences and interests';
COMMENT ON TABLE public.sms_consents IS 'SMS consent tracking for TCPA compliance';
COMMENT ON TABLE public.invitations IS 'Invitation tracking with expiration and acceptance status';
COMMENT ON VIEW public.invitation_summary IS 'Admin view of invitation status with user details';
