/**
 * Fix Event 11 date to be in the future so the button shows correctly
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

async function fixEventDate() {
  try {
    console.log('Fixing Event 11 date and details...');
    
    // Update with a clear future date and all the correct details
    const { data: updateResult, error: updateError } = await supabase
      .from('events_management')
      .update({
        date: 'September 14th, 2025',  // More explicit date format
        image: 'MH Aeriel KS.jpg',     // Fix image path
        button: 'Get Tickets',         // Set button text
        get_tickets_link: 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator'
      })
      .eq('id', 11);

    if (updateError) {
      console.error('Error updating event:', updateError);
      return;
    }

    console.log('✅ Event updated successfully');

    // Verify the update
    const { data: verifyEvent, error: verifyError } = await supabase
      .from('events_management')
      .select('id, title, date, time, image, button, get_tickets_link')
      .eq('id', 11)
      .single();
      
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
    } else {
      console.log('\n🎉 Updated Event 11:');
      console.log(`Title: ${verifyEvent.title}`);
      console.log(`Date: ${verifyEvent.date}`);
      console.log(`Time: ${verifyEvent.time}`);
      console.log(`Image: ${verifyEvent.image}`);
      console.log(`Button: ${verifyEvent.button}`);
      console.log(`Ticket Link: ${verifyEvent.get_tickets_link}`);
      
      // Test the date parsing
      const testDate = new Date(`${verifyEvent.date} ${verifyEvent.time}`);
      const isPast = testDate.getTime() < Date.now();
      console.log(`\nDate parsing test:`);
      console.log(`Parsed date: ${testDate}`);
      console.log(`Is past event: ${isPast}`);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixEventDate();
