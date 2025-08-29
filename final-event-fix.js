/**
 * Final fix for Event 11 with proper future date
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load environment variables
const envContent = fs.readFileSync('supa.env', 'utf8');
const envLines = envContent.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = trimmed.split('=')[1];
  } else if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseKey = trimmed.split('=')[1];
  }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalEventFix() {
  try {
    console.log('Final fix for Event 11...');
    
    // Set a clear future date (September 14, 2025 is in the future)
    // But let's use a format that JavaScript can parse properly
    const { data: updateResult, error: updateError } = await supabase
      .from('events_management')
      .update({
        date: 'September 14, 2025',      // Better format for JS parsing
        time: '6:00 PM',                // Match Eventbrite time
        image: 'MH Aeriel KS.jpg',       // Correct image path
        button: 'Get Tickets',           // Force the button text
        get_tickets_link: 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator'
      })
      .eq('id', 11);

    if (updateError) {
      console.error('Error updating event:', updateError);
      return;
    }

    console.log('✅ Event updated successfully');

    // Test different date formats to see what works
    console.log('\nTesting date parsing:');
    const testFormats = [
      'September 14, 2025 6:00 PM',
      'September 14, 2025',
      'Sep 14, 2025 6:00 PM',
      'Sep 14, 2025'
    ];
    
    testFormats.forEach(format => {
      const testDate = new Date(format);
      const isPast = testDate.getTime() < Date.now();
      console.log(`${format} → ${testDate.toString()} (Past: ${isPast})`);
    });

    // Verify the final result
    const { data: verifyEvent, error: verifyError } = await supabase
      .from('events_management')
      .select('*')
      .eq('id', 11)
      .single();
      
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
    } else {
      console.log('\n🎉 Final Event 11 in database:');
      console.log(JSON.stringify({
        id: verifyEvent.id,
        title: verifyEvent.title,
        date: verifyEvent.date,
        time: verifyEvent.time,
        image: verifyEvent.image,
        button: verifyEvent.button,
        get_tickets_link: verifyEvent.get_tickets_link
      }, null, 2));
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

finalEventFix();
