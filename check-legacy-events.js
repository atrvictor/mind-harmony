/**
 * Check the legacy events table and add September 14th event
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

async function checkLegacyEvents() {
  try {
    console.log('Checking legacy events table...');
    
    // Check the structure of the legacy events table
    const { data: legacyEvents, error: legacyError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
      
    if (legacyError) {
      console.error('Error fetching legacy events:', legacyError);
      return;
    }

    console.log('\nCurrent legacy events:');
    legacyEvents.forEach(event => {
      console.log(`ID ${event.id}: ${event.name || 'Unnamed'}`);
      console.log(`  Slug: ${event.slug || 'No slug'}`);
      console.log(`  Date: ${event.event_date}`);
      console.log(`  Max seats: ${event.max_seats}`);
      console.log('---');
    });

    // Check if there's already a September 14th event
    const sep14Event = legacyEvents.find(event => 
      event.event_date && event.event_date.includes('2025-09-14')
    );

    if (sep14Event) {
      console.log('\n✅ September 14th event already exists in legacy table:');
      console.log(`ID: ${sep14Event.id}`);
      console.log(`Name: ${sep14Event.name}`);
    } else {
      console.log('\n❌ September 14th event NOT found in legacy table');
      console.log('Need to create it for reservation functionality');
      
      // Create the September 14th event in legacy table (without description field)
      console.log('\nCreating September 14th event in legacy table...');
      const { data: newEvent, error: createError } = await supabase
        .from('events')
        .insert({
          name: 'Piano Meditation Experience',
          slug: 'piano-meditation-experience-sep-14',
          event_date: '2025-09-14T17:30:00-07:00', // September 14, 2025 at 5:30 PM PDT
          max_seats: 50
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating legacy event:', createError);
      } else {
        console.log('✅ Successfully created September 14th legacy event:');
        console.log(`New event ID: ${newEvent.id}`);
        console.log(`Name: ${newEvent.event_name}`);
        console.log(`Date: ${newEvent.event_date}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkLegacyEvents();
