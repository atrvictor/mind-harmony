const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read environment variables
const envContent = fs.readFileSync('./supa.env', 'utf8');
let supabaseUrl, supabaseKey;

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = trimmed.split('=')[1];
  }
  if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    supabaseKey = trimmed.split('=')[1];
  }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function createVipEvent() {
  try {
    console.log('Creating VIP 4PM event for September 14th...');
    
    // First check if VIP event already exists
    const { data: existingVip } = await supabase
      .from('events_management')
      .select('*')
      .ilike('date', '%September 14%')
      .ilike('title', '%VIP%')
      .single();
      
    if (existingVip) {
      console.log('✅ VIP event already exists:', existingVip.title);
      return;
    }
    
    // Create the VIP event in events_management table
    const { data: vipEvent, error: vipError } = await supabase
      .from('events_management')
      .insert({
        title: 'VIP Piano Meditation Experience',
        date: 'September 14, 2025',
        time: '4:00 PM',
        location: 'Kate Sessions Park',
        address: '5115 Soledad Road, San Diego, CA 92109',
        description: 'An exclusive piano meditation experience for Mount Soledad neighbors and Boutique Luxury Living guests. Immerse yourself in the healing sounds of live piano music while enjoying guided meditation in the serene outdoor setting.',
        image: 'MH Aeriel KS.jpg',
        featured: false,
        get_tickets_link: null,
        button: 'VIP Only',
        display_order: 0
      })
      .select()
      .single();
      
    if (vipError) {
      console.error('Error creating VIP event:', vipError);
      return;
    }
    
    console.log('✅ VIP event created:', vipEvent);
    
    // Create corresponding entry in legacy events table for reservations
    const { data: legacyVip, error: legacyError } = await supabase
      .from('events')
      .insert({
        name: 'VIP Piano Meditation Experience',
        slug: 'vip-piano-meditation-sep-14-4pm',
        event_date: '2025-09-14T16:00:00-07:00', // 4:00 PM PDT
        max_seats: 30 // Smaller VIP event
      })
      .select()
      .single();
      
    if (legacyError) {
      console.error('Error creating legacy VIP event:', legacyError);
    } else {
      console.log('✅ Legacy VIP event created:', legacyVip);
    }
    
    // Verify both September 14th events exist
    const { data: allSep14, error: checkError } = await supabase
      .from('events_management')
      .select('*')
      .ilike('date', '%September 14%')
      .order('time');
      
    if (!checkError) {
      console.log('\n🎉 All September 14th events:');
      allSep14.forEach(event => {
        console.log(`- ${event.time}: ${event.title} (ID: ${event.id})`);
      });
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createVipEvent();
