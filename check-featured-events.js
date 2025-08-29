/**
 * Check which events are featured and find the Aug 15th one
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

async function checkFeaturedEvents() {
  try {
    console.log('Checking all events for August dates...');
    
    // Get all events
    const { data: allEvents, error } = await supabase
      .from('events_management')
      .select('*')
      .order('id', { ascending: true });
      
    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    console.log('\nAll events with August dates:');
    const augustEvents = allEvents.filter(event => 
      event.date && event.date.toLowerCase().includes('aug')
    );
    
    augustEvents.forEach(event => {
      console.log(`Event ${event.id}: ${event.title}`);
      console.log(`  Date: ${event.date}`);
      console.log(`  Featured: ${event.featured}`);
      console.log(`  Status: ${event.status}`);
      console.log(`  Active: ${event.is_active}`);
      console.log('---');
    });

    // Also check for any events with "15" in the date
    console.log('\nEvents with "15" in date:');
    const fifteenthEvents = allEvents.filter(event => 
      event.date && event.date.includes('15')
    );
    
    fifteenthEvents.forEach(event => {
      console.log(`Event ${event.id}: ${event.title}`);
      console.log(`  Date: ${event.date}`);
      console.log(`  Featured: ${event.featured}`);
      console.log('---');
    });

    // Check what events are currently featured
    console.log('\nCurrently featured events:');
    const featuredEvents = allEvents.filter(event => event.featured);
    featuredEvents.forEach(event => {
      console.log(`Event ${event.id}: ${event.title}`);
      console.log(`  Date: ${event.date}`);
      console.log(`  Featured: ${event.featured}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

checkFeaturedEvents();
