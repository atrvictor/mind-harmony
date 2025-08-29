/**
 * Check if September 14th event appears in admin ticket management
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

async function checkAdminEvents() {
  try {
    console.log('Checking events in admin ticket management...');
    
    // This is what the admin panel queries for ticket management
    const { data: adminEvents, error: adminError } = await supabase
      .from('events')
      .select(`
        id,
        name,
        slug,
        event_date,
        max_seats
      `)
      .order('event_date', { ascending: true });
      
    if (adminError) {
      console.error('Error fetching admin events:', adminError);
      return;
    }

    console.log('\nEvents in admin ticket management:');
    adminEvents.forEach(event => {
      const eventDate = new Date(event.event_date);
      console.log(`ID ${event.id}: ${event.name || 'Unnamed'}`);
      console.log(`  Slug: ${event.slug}`);
      console.log(`  Date: ${eventDate.toLocaleString()}`);
      console.log(`  Max seats: ${event.max_seats}`);
      console.log('---');
    });

    // Check reservations for each event
    console.log('\nReservations for each event:');
    for (const event of adminEvents) {
      const { data: reservations, error: resError } = await supabase
        .from('reservations')
        .select('*')
        .eq('event_id', event.id);
        
      if (!resError) {
        const totalReserved = reservations.reduce((sum, res) => sum + res.seats, 0);
        console.log(`Event ${event.id} (${event.name || 'Unnamed'}): ${totalReserved} seats reserved`);
      }
    }

    // Specifically check for September 14th event
    const sep14Event = adminEvents.find(event => 
      event.event_date && event.event_date.includes('2025-09-14')
    );

    if (sep14Event) {
      console.log('\n✅ September 14th event IS in admin ticket management:');
      console.log(`ID: ${sep14Event.id}`);
      console.log(`Name: ${sep14Event.name}`);
      console.log(`Slug: ${sep14Event.slug}`);
    } else {
      console.log('\n❌ September 14th event NOT found in admin ticket management');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminEvents();
