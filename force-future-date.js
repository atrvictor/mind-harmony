/**
 * Force the event to have a clearly future date
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

async function forceFutureDate() {
  try {
    console.log('Setting Event 11 to a clearly future date...');
    
    // Use a date that's definitely in the future and easy to parse
    const futureDate = 'December 14, 2025';
    
    const { error: updateError } = await supabase
      .from('events_management')
      .update({
        date: futureDate,
        time: '5:30 PM',
        button: 'Get Tickets',
        image: 'MH Aeriel KS.jpg',
        get_tickets_link: 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator'
      })
      .eq('id', 11);
      
    if (updateError) {
      console.error('Update failed:', updateError);
      return;
    }

    console.log('✅ Updated to December 14, 2025');

    // Wait a moment for any triggers to run
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check the result
    const { data: result, error: checkError } = await supabase
      .from('events_management')
      .select('date, time, button, image, get_tickets_link')
      .eq('id', 11)
      .single();
      
    if (checkError) {
      console.error('Check failed:', checkError);
      return;
    }

    console.log('\n📅 Updated Event:');
    console.log(`Date: ${result.date}`);
    console.log(`Time: ${result.time}`);
    console.log(`Button: ${result.button}`);
    console.log(`Image: ${result.image}`);
    console.log(`Link: ${result.get_tickets_link ? 'Set' : 'Missing'}`);

    // Test the date parsing with the new date
    const testDate = new Date(`${result.date} ${result.time}`);
    const isPast = testDate.getTime() < Date.now();
    console.log(`\nParsed: ${testDate}`);
    console.log(`Is past: ${isPast}`);

    if (result.button === 'Get Tickets') {
      console.log('\n🎉 SUCCESS! Button now shows "Get Tickets"');
      console.log('The event should now work correctly on your website.');
    } else {
      console.log('\n❌ Button still shows "Past Event" - there may be other logic overriding it');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

forceFutureDate();
