/**
 * Final attempt to fix the button by ensuring proper date format
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

async function fixButtonFinal() {
  try {
    console.log('Final attempt to fix the button...');
    
    // The issue is likely the date format. Let's try a clearly future date
    // Since September 14, 2025 might be parsed as past, let's use a different approach
    
    console.log('\nStep 1: Setting a clearly future date...');
    const { error: dateError } = await supabase
      .from('events_management')
      .update({ 
        date: 'December 14, 2025',  // Clearly in the future
        button: 'Get Tickets'
      })
      .eq('id', 11);
    
    if (dateError) {
      console.error('Date update failed:', dateError);
    } else {
      console.log('✅ Date updated to December 14, 2025');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 2: Now set it back to the correct September date but with better format
    console.log('\nStep 2: Setting correct September date with better format...');
    const { error: correctDateError } = await supabase
      .from('events_management')
      .update({ 
        date: 'September 14, 2025',  // Proper format without ordinal
        button: 'Get Tickets'
      })
      .eq('id', 11);
    
    if (correctDateError) {
      console.error('Correct date update failed:', correctDateError);
    } else {
      console.log('✅ Date set to September 14, 2025');
    }

    // Step 3: Force button update multiple times
    console.log('\nStep 3: Force button update...');
    for (let i = 0; i < 3; i++) {
      const { error } = await supabase
        .from('events_management')
        .update({ button: 'Get Tickets' })
        .eq('id', 11);
      
      if (!error) {
        console.log(`✅ Button update attempt ${i + 1} successful`);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Final check
    console.log('\n📋 Final verification...');
    const { data: finalEvent, error: verifyError } = await supabase
      .from('events_management')
      .select('id, title, date, time, image, button, get_tickets_link')
      .eq('id', 11)
      .single();
      
    if (verifyError) {
      console.error('Verification failed:', verifyError);
    } else {
      console.log('\n🎉 Final Event 11 status:');
      console.log(`Title: ${finalEvent.title}`);
      console.log(`Date: ${finalEvent.date}`);
      console.log(`Time: ${finalEvent.time}`);
      console.log(`Image: ${finalEvent.image}`);
      console.log(`Button: ${finalEvent.button}`);
      console.log(`Link: ${finalEvent.get_tickets_link ? 'Set' : 'Missing'}`);
      
      // Test date parsing
      const testDate = new Date(`${finalEvent.date} ${finalEvent.time}`);
      console.log(`\nDate test: ${testDate} (Valid: ${!isNaN(testDate.getTime())})`);
      console.log(`Is future: ${testDate.getTime() > Date.now()}`);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixButtonFinal();
