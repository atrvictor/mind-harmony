/**
 * Script to update Event 2 with aerial image and Eventbrite ticket link
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

async function updateEvent2() {
  try {
    console.log('Checking all events in database...');
    
    // First, let's see all events in the database
    const { data: allEvents, error: fetchError } = await supabase
      .from('events_management')
      .select('*')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('Error fetching events:', fetchError);
      return;
    }

    console.log('All events in database:');
    allEvents.forEach((event, index) => {
      console.log(`Event ${event.id}: ${event.title}`);
    });

    // Find the event that should be "Event 2" (the Sunset Piano Meditation Popup from memory)
    // Based on the Eventbrite link, this should be "Victor Kulish Piano Meditation Experience"
    const targetEvent = allEvents.find(event => 
      event.title.toLowerCase().includes('sunset') || 
      event.title.toLowerCase().includes('victor kulish') ||
      event.title.toLowerCase().includes('meditation experience') ||
      event.id === 2
    ) || allEvents.find(event => event.id === 11); // Try event 11 as fallback

    let eventToUpdate = targetEvent;
    if (!eventToUpdate) {
      console.log('Could not find target event. Using the second event in the list...');
      if (allEvents.length >= 2) {
        eventToUpdate = allEvents[1]; // Second event (index 1)
      } else {
        console.error('Not enough events in database');
        return;
      }
    }

    console.log(`\nFound target event (ID ${eventToUpdate.id}): ${eventToUpdate.title}`);

    // Update the target event with new image and ticket information
    console.log(`\nUpdating Event ${eventToUpdate.id}...`);
    
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events_management')
      .update({
        image: 'MH Aeriel KS.jpg',
        button: 'Get Tickets',
        get_tickets_link: 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator'
      })
      .eq('id', eventToUpdate.id)
      .select();
      
    console.log('Fixed issues:');
    console.log('- Image path: MH Aeriel KS.jpg (removed leading slash)');
    console.log('- Button: Get Tickets (changed from Past Event)');

    if (updateError) {
      console.error('Error updating event:', updateError);
      return;
    }

    console.log('Update query executed successfully!');
    console.log('Update response:', updatedEvent);
    
    // Let's verify the update by reading the event back
    console.log('\nVerifying update by reading event back...');
    const { data: verifyEvent, error: verifyError } = await supabase
      .from('events_management')
      .select('*')
      .eq('id', eventToUpdate.id)
      .single();
      
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
    } else {
      console.log('Verified event data:');
      console.log(JSON.stringify(verifyEvent, null, 2));
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateEvent2();
