/**
 * Direct fix for Event 11 with better error handling
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

async function fixEvent11() {
  try {
    console.log('Fixing Event 11 step by step...');
    
    // Step 1: Fix the image path
    console.log('\nStep 1: Fixing image path...');
    const { data: imageUpdate, error: imageError } = await supabase
      .from('events_management')
      .update({ image: 'MH Aeriel KS.jpg' })
      .eq('id', 11);

    if (imageError) {
      console.error('Error updating image:', imageError);
    } else {
      console.log('✅ Image path updated successfully');
    }

    // Step 2: Fix the button
    console.log('\nStep 2: Fixing button text...');
    const { data: buttonUpdate, error: buttonError } = await supabase
      .from('events_management')
      .update({ button: 'Get Tickets' })
      .eq('id', 11);

    if (buttonError) {
      console.error('Error updating button:', buttonError);
    } else {
      console.log('✅ Button updated successfully');
    }

    // Step 3: Ensure ticket link is correct
    console.log('\nStep 3: Ensuring ticket link is correct...');
    const { data: linkUpdate, error: linkError } = await supabase
      .from('events_management')
      .update({ 
        get_tickets_link: 'https://www.eventbrite.com/e/mind-harmony-presents-victor-kulish-piano-meditation-experience-tickets-1564598499229?aff=oddtdtcreator'
      })
      .eq('id', 11);

    if (linkError) {
      console.error('Error updating ticket link:', linkError);
    } else {
      console.log('✅ Ticket link updated successfully');
    }

    // Final verification
    console.log('\n📋 Final verification...');
    const { data: finalEvent, error: verifyError } = await supabase
      .from('events_management')
      .select('id, title, image, button, get_tickets_link')
      .eq('id', 11)
      .single();
      
    if (verifyError) {
      console.error('Error verifying final result:', verifyError);
    } else {
      console.log('\n🎉 Final Event 11 status:');
      console.log(`Title: ${finalEvent.title}`);
      console.log(`Image: ${finalEvent.image}`);
      console.log(`Button: ${finalEvent.button}`);
      console.log(`Ticket Link: ${finalEvent.get_tickets_link}`);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixEvent11();
