-- Migration: Create comprehensive events management table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.events_management (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  address TEXT,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  get_tickets_link TEXT,
  button TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on display_order for efficient sorting
CREATE INDEX IF NOT EXISTS idx_events_display_order ON public.events_management(display_order, created_at);

-- Create an index on is_active for efficient filtering
CREATE INDEX IF NOT EXISTS idx_events_active ON public.events_management(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.events_management ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view events)
CREATE POLICY "Public can view active events" ON public.events_management
  FOR SELECT USING (is_active = true);

-- Create policy for admin write access (only authenticated admins can modify)
CREATE POLICY "Admins can manage events" ON public.events_management
  FOR ALL USING (auth.jwt() ->> 'email' = 'atrvictor@gmail.com');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at_trigger
  BEFORE UPDATE ON public.events_management
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();

-- Insert initial events data from your current events
INSERT INTO public.events_management (
  title, date, time, location, address, description, image, 
  featured, get_tickets_link, button, display_order
) VALUES 
(
  'Roots Meditation & Piano Journey',
  'August 15th, 2025',
  '5:00 PM',
  NULL,
  NULL,
  'Experience the compositions from the upcoming Roots Piano album, accompanied by an immersive story that guides you between the songs. Designed as both a meditation and a journey, it leads you into deep relaxation and inner peace.',
  '/MH Milana DSC03928.jpg',
  TRUE,
  'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1560199632099?aff=oddtdtcreator',
  NULL,
  1
),
(
  'Piano Meditation Experience',
  'July 19th, 2025',
  '6:30 PM',
  'Mission Bay',
  NULL,
  'Breathe in the ocean air, and let Victor Kulish guide you into deep calm as the sun melts into Mission Bay.',
  '/MH Milana DSC03938.jpg',
  FALSE,
  NULL,
  'Past Event',
  2
),
(
  'Sunset Piano Meditation Popup',
  'July 13th, 2025',
  '6:30 PM',
  'Palisades South Park',
  '4960 Ocean Blvd, San Diego, CA, 92109',
  'Join us for an evening of guided meditation and piano melodies as the sun sets, creating a tranquil atmosphere for relaxation and reflection.',
  '/MH_Columet_edited.png',
  FALSE,
  NULL,
  'Past Event',
  3
),
(
  'Candlelight Yoga and Piano',
  'May 18th, 2025',
  '7:00 PM',
  NULL,
  NULL,
  'Experience the harmonious blend of gentle yoga flows guided by live piano music in a serene, candlelit environment. Perfect for all levels.',
  '/CandlelightYoga.jpg',
  FALSE,
  NULL,
  'Past Event',
  4
),
(
  'Morning Awakening: Piano & Breathwork',
  'May 12th, 2025',
  '8:00 AM',
  NULL,
  NULL,
  'Start your day with intention through this energizing combination of breathwork exercises and uplifting piano compositions.',
  '/piano photos/piano_keys_tricolor_nocandle_1.jpg',
  FALSE,
  NULL,
  'Past Event',
  5
),
(
  'Piano Meditation for Stress Relief',
  'April 10th, 2025',
  '6:00 PM',
  NULL,
  NULL,
  'A focused session designed specifically to address stress and anxiety through guided meditation and calming piano melodies.',
  '/piano photos/piano_macro_keys_purple_candlelight_1.jpg',
  FALSE,
  NULL,
  'Past Event',
  6
);

-- Verify the data was inserted correctly
SELECT * FROM public.events_management ORDER BY display_order;