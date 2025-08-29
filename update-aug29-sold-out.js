/**
 * Update August 29th event to show as sold out
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

async function updateAug29SoldOut() {
  try {
    console.log('Updating August 29th event to sold out...');
    
    // First, find the August 29th event in events_management table
    const { data: aug29Events, error: fetchError } = await supabase
      .from('events_management')
      .select('*')
      .ilike('date', '%august%29%')
      .order('id');
      
    if (fetchError) {
      console.error('Error fetching August 29th events:', fetchError);
      return;
    }

    console.log('August 29th events found:');
    aug29Events.forEach(event => {
      console.log(`Event ${event.id}: ${event.title}`);
      console.log(`  Date: ${event.date}`);
      console.log(`  Current sold_out: ${event.sold_out}`);
    });

    // Update the featured August 29th event (Event 10) to be sold out
    const featuredAug29 = aug29Events.find(e => e.featured === true) || aug29Events[0];
    
    if (featuredAug29) {
      console.log(`\nUpdating Event ${featuredAug29.id} to sold out...`);
      
      const { error: updateError } = await supabase
        .from('events_management')
        .update({ 
          sold_out: true,
          button: 'Guest List Full'
        })
        .eq('id', featuredAug29.id);
        
      if (updateError) {
        console.error('Error updating to sold out:', updateError);
      } else {
        console.log('✅ Event marked as sold out');
      }
    }

    // Also update the legacy event (Event 2) if needed
    console.log('\nChecking legacy events table...');
    const { data: legacyEvents, error: legacyError } = await supabase
      .from('events')
      .select('*')
      .order('id');
      
    if (!legacyError) {
      console.log('Legacy events:');
      legacyEvents.forEach(event => {
        console.log(`Legacy Event ${event.id}: ${event.name || 'Unnamed'}`);
        console.log(`  Date: ${event.event_date}`);
        console.log(`  Max seats: ${event.max_seats}`);
      });
      
      // Get reservations for August event (likely Event 2)
      const aug29Legacy = legacyEvents.find(e => 
        e.event_date && (e.event_date.includes('2025-08-30') || e.event_date.includes('2025-08-29'))
      );
      
      if (aug29Legacy) {
        const { data: reservations } = await supabase
          .from('reservations')
          .select('seats')
          .eq('event_id', aug29Legacy.id);
          
        const totalReserved = reservations?.reduce((sum, res) => sum + res.seats, 0) || 0;
        console.log(`\nAugust 29th legacy event (ID ${aug29Legacy.id}):`);
        console.log(`Reserved: ${totalReserved}/${aug29Legacy.max_seats}`);
        console.log(`Is full: ${totalReserved >= aug29Legacy.max_seats}`);
      }
    }

    // Final verification
    const { data: verification, error: verifyError } = await supabase
      .from('events_management')
      .select('id, title, date, sold_out, button')
      .eq('id', featuredAug29?.id)
      .single();
      
    if (!verifyError && verification) {
      console.log('\n🎉 Final status:');
      console.log(`Event ${verification.id}: ${verification.title}`);
      console.log(`Date: ${verification.date}`);
      console.log(`Sold out: ${verification.sold_out}`);
      console.log(`Button: ${verification.button}`);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

updateAug29SoldOut();
